"use client";
import { type Variants, m, useReducedMotion, LazyMotion, domAnimation } from "motion/react";
import useSharedIntersectionObserver from "@/utils/hooks/useSharedIntersectionObserver";
import { useState, useEffect, useMemo, useRef, useCallback, memo } from "react";
import useDevicePerformance from "@/utils/hooks/useDevicePerformance";
import useHasBeenMounted from "@/utils/hooks/useHasBeenMounted";
import { cn } from "@/utils/functions";

import type { ReactNode, CSSProperties, ElementType, Ref, ComponentPropsWithoutRef } from "react";
import type { IBlurOnScrollProps } from "@/types/components";

export type CallBackEntryType = { isIntersecting: boolean; intersectionRatio: number; entry: IntersectionObserverEntry };

// Extend IBlurOnScrollProps to include the 'as' prop for polymorphism
export type PolymorphicBlurOnScrollProps<T extends ElementType> = {
	as?: T;
} & IBlurOnScrollProps &
	Omit<ComponentPropsWithoutRef<T>, keyof IBlurOnScrollProps | "ref">; // Still omit 'ref'

/**
 * Inner component implementation with memoization for performance.
 * @internal
 */
const BlurOnScrollInner = memo(function BlurOnScroll<T extends ElementType = "div">(componentProps: PolymorphicBlurOnScrollProps<T>): ReactNode {
	// Props (Destructured)
	const {
		easing = [0.25, 0.1, 0.25, 1.0],
		transitionDuration = 0.4,
		as: Component = "div",
		direction = "none",
		rootMargin = "0px",
		onVisibilityChange,
		priority = "high",
		disabled = false,
		threshold = 0.1,
		debounceMs = 0,
		blurAmount = 5,
		distance = 20,
		once = false,
		children,
		delay = 0,
		className,
		id = "",
		style,
		...props
	} = componentProps;

	// States
	const [hasBeenVisible, setHasBeenVisible] = useState<boolean>(false);
	const [isVisible, setIsVisible] = useState<boolean>(false);

	// Ref
	const elementRef = useRef<HTMLElement>(null);

	// Performance optimizations
	const devicePerformance = useDevicePerformance();
	const prefersReducedMotion = useReducedMotion();

	// Use the shared intersection observer with custom options
	const intersectionObserver = useSharedIntersectionObserver<HTMLElement>({
		threshold: Array.isArray(threshold) ? threshold : [0, threshold],
		rootMargin,
		debounceMs,
	});

	// Calculate actual animation parameters based on device and user preferences
	const actualBlurAmount = useMemo(() => {
		if (prefersReducedMotion) return 0;
		if (devicePerformance === "low") return Math.min(2, blurAmount);
		return blurAmount;
	}, [blurAmount, prefersReducedMotion, devicePerformance]);

	const actualDuration = useMemo(() => {
		if (prefersReducedMotion) return 0.1;
		if (devicePerformance === "low") return Math.min(0.2, transitionDuration);
		return transitionDuration;
	}, [transitionDuration, prefersReducedMotion, devicePerformance]);

	const actualDistance = useMemo(() => {
		if (prefersReducedMotion) return 0;
		if (devicePerformance === "low") return Math.min(10, distance);
		return distance;
	}, [distance, prefersReducedMotion, devicePerformance]);

	// Handle visibility changes using the intersection observer hook
	const handleVisibilityChange = useCallback(
		({ intersectionRatio }: IntersectionObserverEntry) => {
			// Only consider visible if it exceeds threshold
			const isVisibleEnough = intersectionRatio >= (typeof threshold === "number" ? threshold : threshold[0]);

			// Use rAF to batch updates for better performance
			requestAnimationFrame(() => {
				setIsVisible(() => isVisibleEnough);
				if (isVisibleEnough && !hasBeenVisible) setHasBeenVisible(() => true);
				if (onVisibilityChange) onVisibilityChange(isVisibleEnough);
			});
		},
		[threshold, hasBeenVisible, onVisibilityChange]
	);

	// Setup intersection observer
	useEffect(() => {
		// Ensure elementRef.current is not null and is an HTMLElement for IntersectionObserver
		if (disabled || !elementRef.current) return;

		const element = elementRef.current;

		// Setup callback function for the observer
		const cb = (e: CallBackEntryType): void => handleVisibilityChange(e.entry);

		// Use the refCallback pattern from the hook
		intersectionObserver.observeRef(cb)(element);

		return () => {
			intersectionObserver.unobserve(element);
		};
	}, [disabled, handleVisibilityChange, intersectionObserver]);

	// Calculate if animations should be applied
	const shouldAnimate = useMemo(() => !disabled && (!once || (once && !hasBeenVisible)), [disabled, once, hasBeenVisible]);

	// CSS property optimizations
	useEffect(() => {
		// Ensure elementRef.current is not null and is an HTMLElement
		if (elementRef.current && shouldAnimate) {
			// Set will-change only when animation is about to happen
			elementRef.current.style.willChange = "opacity, transform, filter";

			// Preload motion resources for smoother first animation
			if (typeof window !== "undefined") {
				const preconnect = document.createElement("link");
				preconnect.rel = "preconnect";
				preconnect.href = "https://framerusercontent.com";
				document.head.appendChild(preconnect);

				return () => document.head.contains(preconnect) && document.head.removeChild(preconnect);
			}

			return () => {
				if (elementRef.current) elementRef.current.style.willChange = "auto";
			};
		}
	}, [shouldAnimate]);

	// Define animation variants based on calculated parameters
	const variants = useMemo(
		(): Variants => ({
			visible: { opacity: 1, filter: "blur(0px)", x: 0, y: 0, transition: { duration: actualDuration, delay: delay, ease: easing } },
			hidden: {
				x: direction === "left" ? actualDistance : direction === "right" ? -actualDistance : 0,
				y: direction === "up" ? actualDistance : direction === "down" ? -actualDistance : 0,
				filter: actualBlurAmount > 0 ? `blur(${actualBlurAmount}px)` : undefined,
				transition: { duration: actualDuration, delay: delay, ease: easing },
				opacity: 0,
			},
		}),
		[actualBlurAmount, actualDuration, actualDistance, delay, direction, easing]
	);

	// Fix TypeScript typing issues with CSS properties by using proper type casting
	const combinedStyle = useMemo(() => {
		const baseStyles: CSSProperties = { ...style };

		// Add these properties only in a type-safe way
		if (shouldAnimate) {
			baseStyles.WebkitBackfaceVisibility = "hidden";
			baseStyles.WebkitPerspective = "1000px";
		}

		return baseStyles;
	}, [style, shouldAnimate]);

	const castedRef = elementRef as Ref<any>;

	// For very low priority items or when disabled, use a simpler render
	if ((priority === "low" && !isVisible && !hasBeenVisible) || disabled) {
		return (
			<Component ref={castedRef} className={cn(className)} style={{ opacity: 0, ...combinedStyle }} {...props}>
				{children}
			</Component>
		);
	}

	// Final visibility determination
	const currentState = isVisible || (once && hasBeenVisible) ? "visible" : "hidden";

	// Use m(Component) for Framer Motion animation

	const MotionComponent = useMemo(() => m.create(Component), [Component]);

	return typeof window === "undefined" ? (
		<Component id={id} ref={castedRef} className={cn(className)} style={combinedStyle} {...props}>
			{children}
		</Component>
	) : (
		<MotionComponent
			className={cn(className)}
			animate={currentState}
			style={combinedStyle}
			variants={variants}
			initial="hidden"
			ref={castedRef}
			{...props}>
			{children}
		</MotionComponent>
	);
});

/**
 * BlurOnScroll is a high-performance polymorphic component that adds blur and motion effects when elements enter or
 * leave the viewport during scrolling. It's built on Framer Motion and optimized for React with
 * performance-focused features like shared observers, adaptive animations based on device capabilities,
 * and priority-based rendering.
 *
 * @example Basic usage with default `div`
 * ```tsx
 * // Simple card that fades and blurs in from below
 * <BlurOnScroll direction="up" blurAmount={3}>
 * <div className="card">
 * <h2>Hello World</h2>
 * <p>This content will animate in when scrolled into view</p>
 * </div>
 * </BlurOnScroll>
 * ```
 *
 * @example Usage with a different HTML element (`article`)
 * ```tsx
 * <BlurOnScroll as="article" direction="right" blurAmount={5}>
 * <h3>My Article</h3>
 * <p>This article will slide and blur in from the right.</p>
 * </BlurOnScroll>
 * ```
 *
 * @example Usage with a custom React component
 * ```tsx
 * // Assuming MyCustomCard is a React component that accepts className and style props
 * // For custom components, it's highly recommended to use React.forwardRef.
 * const MyCustomCard = React.forwardRef(({ children, className, style }, ref) => (
 * <div ref={ref} className={className} style={style}>
 * {children}
 * </div>
 * ));
 *
 * <BlurOnScroll as={MyCustomCard} direction="up" blurAmount={3}>
 * <p>This content is inside a custom card component.</p>
 * </BlurOnScroll>
 * ```
 */
export default function PolyBlurOnScroll<T extends ElementType = "div">(props: PolymorphicBlurOnScrollProps<T>): ReactNode {
	// Use our safe animation hook to handle SSR
	const isHydrated = useHasBeenMounted();

	// Determine the component to render when not hydrated
	const Component = props.as || "div";

	// Only load Framer Motion when component is used
	return isHydrated ? (
		<LazyMotion features={domAnimation} strict>
			<BlurOnScrollInner {...props} />
		</LazyMotion>
	) : (
		<Component className={props.className} style={props.style}>
			{props.children}
		</Component>
	);
}
