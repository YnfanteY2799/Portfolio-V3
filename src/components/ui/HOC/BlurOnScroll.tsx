"use client";
import { type ReactNode, type CSSProperties, useState, useEffect, useMemo, useRef, useCallback, memo } from "react";
import useSharedIntersectionObserver from "@/utils/hooks/useSharedIntersectionObserver.ts";
import { m, useReducedMotion, LazyMotion, domAnimation } from "motion/react";
import useDevicePerformance from "@/utils/hooks/useDevicePerformance.ts";
import useHasBeenMounted from "@/utils/hooks/useHasBeenMounted.ts";
import { cn } from "@/utils/functions";

import type { IBlurOnScrollProps, CallBackEntryType } from "@/types/components.ts";

/**
 * Inner component implementation with memoization for performance.
 * @internal
 */
const BlurOnScrollInner = memo(function BlurOnScroll(componentProps: IBlurOnScrollProps): ReactNode {
	// Props (Destructured)
	const {
		easing = [0.25, 0.1, 0.25, 1.0],
		transitionDuration = 0.4,
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
	const [hasBeenVisible, setHasBeenVisible] = useState(false);
	const [isVisible, setIsVisible] = useState(false);
	const elementRef = useRef<HTMLDivElement>(null);

	// Performance optimizations
	const devicePerformance = useDevicePerformance();
	const prefersReducedMotion = useReducedMotion();

	// Use the shared intersection observer with custom options
	const intersectionObserver = useSharedIntersectionObserver({
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
		if (elementRef.current && shouldAnimate) {
			// Set will-change only when animation is about to happen
			elementRef.current.style.willChange = "opacity, transform, filter";

			// Preload motion resources for smoother first animation
			if (typeof window !== "undefined") {
				const preconnect = document.createElement("link");
				preconnect.rel = "preconnect";
				preconnect.href = "https://framerusercontent.com";
				document.head.appendChild(preconnect);

				return () => document.head.removeChild(preconnect);
			}

			return () => {
				if (elementRef.current) elementRef.current.style.willChange = "auto";
			};
		}
	}, [shouldAnimate]);

	// Define animation variants based on calculated parameters
	const variants = useMemo(
		() => ({
			visible: { opacity: 1, filter: "blur(0px)", x: 0, y: 0, transition: { duration: actualDuration, delay: delay, ease: easing } },
			hidden: {
				opacity: 0,
				filter: actualBlurAmount > 0 ? `blur(${actualBlurAmount}px)` : undefined,
				x: direction === "left" ? actualDistance : direction === "right" ? -actualDistance : 0,
				y: direction === "up" ? actualDistance : direction === "down" ? -actualDistance : 0,
				transition: { duration: actualDuration, delay: delay, ease: easing },
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

	// For very low priority items or when disabled, use a simpler render
	if ((priority === "low" && !isVisible && !hasBeenVisible) || disabled) {
		return (
			<div ref={elementRef} className={cn(className)} style={{ opacity: 0, ...combinedStyle }} {...props}>
				{children}
			</div>
		);
	}

	// Final visibility determination
	const currentState = isVisible || (once && hasBeenVisible) ? "visible" : "hidden";

	return typeof window === "undefined" ? (
		<div id={id} ref={elementRef} className={cn(className)} style={combinedStyle} {...props}>
			{children}
		</div>
	) : (
		<m.div
			className={cn(className)}
			animate={currentState}
			style={combinedStyle}
			variants={variants}
			ref={elementRef}
			initial="hidden"
			{...props}>
			{children}
		</m.div>
	);
});

export default function BlurOnScroll(props: IBlurOnScrollProps): ReactNode {
	// Use our safe animation hook to handle SSR
	const isHydrated = useHasBeenMounted();

	// Only load Framer Motion when component is used
	return isHydrated ? (
		<LazyMotion features={domAnimation} strict>
			<BlurOnScrollInner {...props} />
		</LazyMotion>
	) : (
		<div className={props.className} style={props.style}>
			{props.children}
		</div>
	);
}
