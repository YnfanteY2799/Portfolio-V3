"use client";
import { type LegacyAnimationControls, type Variants, type SVGMotionProps, type UseInViewOptions, useAnimation } from "motion/react";
import { cloneElement, createContext, isValidElement, useCallback, useContext, useEffect, useRef, useState } from "react";
import useIsInView from "@/utils/hooks/useIsInView";
import { cn } from "@/utils/functions";

import type { ComponentType, HTMLAttributes, ReactElement, ReactNode, MouseEvent, PointerEvent, RefObject, Ref, SyntheticEvent } from "react";

export const staticAnimations = {
	path: {
		initial: { pathLength: 1, opacity: 1 },
		animate: {
			transition: { duration: 0.8, ease: "easeInOut", opacity: { duration: 0.01 } },
			pathLength: [0.05, 1],
			opacity: [0, 1],
		},
	} as Variants,
	"path-loop": {
		initial: { pathLength: 1, opacity: 1 },
		animate: {
			transition: { duration: 1.6, ease: "easeInOut", opacity: { duration: 0.01 } },
			pathLength: [1, 0.05, 1],
			opacity: [1, 0, 1],
		},
	} as Variants,
} as const;

type TriggerProp<T = string> = boolean | StaticAnimations | T;
type StaticAnimations = keyof typeof staticAnimations;
type Trigger = TriggerProp<string>;

export interface AnimateIconContextValue {
	animateOnViewMargin?: UseInViewOptions["margin"];
	controls: LegacyAnimationControls | undefined;
	animation: StaticAnimations | string;
	initialOnAnimateEnd?: boolean;
	animateOnViewOnce?: boolean;
	animateOnHover?: Trigger;
	animateOnView?: Trigger;
	animateOnTap?: Trigger;
	loopDelay: number;
	animate?: Trigger;
	active: boolean;
	delay?: number;
	loop: boolean;
}

export interface DefaultIconProps<T = string> {
	onAnimateChange?: (value: boolean, animation: StaticAnimations | string) => void;
	animateOnViewMargin?: UseInViewOptions["margin"];
	animation?: T | StaticAnimations;
	animateOnHover?: TriggerProp<T>;
	animateOnView?: TriggerProp<T>;
	animateOnTap?: TriggerProp<T>;
	initialOnAnimateEnd?: boolean;
	animateOnViewOnce?: boolean;
	onAnimateStart?: () => void;
	onAnimateEnd?: () => void;
	animate?: TriggerProp<T>;
	loopDelay?: number;
	loop?: boolean;
	delay?: number;
}

export interface AnimateIconProps<T = string> extends DefaultIconProps<T> {
	children: ReactNode;
	asChild?: boolean;
}

export interface IconProps<T>
	extends DefaultIconProps<T>,
		Omit<SVGMotionProps<SVGSVGElement>, "animate" | "onAnimationStart" | "onAnimationEnd"> {
	size?: number;
}

export interface IconWrapperProps<T> extends IconProps<T> {
	icon: ComponentType<IconProps<T>>;
}

const AnimateIconContext = createContext<AnimateIconContextValue | null>(null);

export function useAnimateIconContext() {
	const context = useContext(AnimateIconContext);
	if (!context)
		return {
			controls: undefined,
			animation: "default",
			loop: false,
			loopDelay: 0,
			active: false,
			animate: undefined,
			animateOnHover: undefined,
			animateOnTap: undefined,
			animateOnView: undefined,
			animateOnViewMargin: "0px" as UseInViewOptions["margin"],
			animateOnViewOnce: true,
			initialOnAnimateEnd: false,
			delay: 0,
		};
	return context;
}

function composeEventHandlers<E extends SyntheticEvent<unknown>>(theirs?: (event: E) => void, ours?: (event: E) => void) {
	return (event: E) => {
		theirs?.(event);
		ours?.(event);
	};
}

function mergeRefs<T>(...refs: Array<Ref<T> | undefined>) {
	return (value: T) => {
		for (const ref of refs) {
			if (!ref) continue;
			if (typeof ref === "function") ref(value);
			else (ref as RefObject<T | null>).current = value;
		}
	};
}

type AnyProps = Record<string, any>;

type SlotProps<E extends Element = HTMLElement> = {
	children: ReactElement;
} & HTMLAttributes<E> &
	AnyProps;

function Slot<E extends Element = HTMLElement>({ children, ...slotProps }: SlotProps<E>) {
	if (!isValidElement(children)) return children;

	const {
		onPointerDown: sOnPointerDown,
		onMouseEnter: sOnMouseEnter,
		onMouseLeave: sOnMouseLeave,
		onPointerUp: sOnPointerUp,
		className: slotClassName,
		style: slotStyle,
		ref: slotRef,
		...restSlot
	} = slotProps;

	const {
		onPointerDown: cOnPointerDown,
		onMouseEnter: cOnMouseEnter,
		onMouseLeave: cOnMouseLeave,
		className: childClassName,
		onPointerUp: cOnPointerUp,
		style: childStyle,
		ref: childRef,
		...restChild
	} = (children.props ?? {}) as AnyProps;

	const mergedProps: AnyProps = {
		...restChild,
		...restSlot,
		className: cn(childClassName, slotClassName),
		style: { ...(childStyle || {}), ...(slotStyle || {}) },
		ref: mergeRefs(childRef, slotRef),
		onMouseEnter: composeEventHandlers(cOnMouseEnter, sOnMouseEnter),
		onMouseLeave: composeEventHandlers(cOnMouseLeave, sOnMouseLeave),
		onPointerDown: composeEventHandlers(cOnPointerDown, sOnPointerDown),
		onPointerUp: composeEventHandlers(cOnPointerUp, sOnPointerUp),
	};

	return cloneElement(children, mergedProps);
}

export function AnimateIcon({
	initialOnAnimateEnd = false,
	animateOnViewMargin = "0px",
	animateOnViewOnce = true,
	animation = "default",
	onAnimateChange,
	asChild = true,
	animateOnHover,
	onAnimateStart,
	animateOnView,
	loopDelay = 0,
	loop = false,
	onAnimateEnd,
	animateOnTap,
	delay = 0,
	children,
	animate,
}: AnimateIconProps): ReactElement {
	const controls = useAnimation();

	const [localAnimate, setLocalAnimate] = useState<boolean>(() => {
		if (animate === undefined || animate === false) return false;
		return delay <= 0;
	});
	const [currentAnimation, setCurrentAnimation] = useState<string | StaticAnimations>(typeof animate === "string" ? animate : animation);

	const delayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const startAnimation = useCallback(
		(trigger: TriggerProp) => {
			const next = typeof trigger === "string" ? trigger : animation;
			if (delayRef.current) {
				clearTimeout(delayRef.current);
				delayRef.current = null;
			}
			setCurrentAnimation(next);
			if (delay > 0) {
				setLocalAnimate(false);
				delayRef.current = setTimeout(() => setLocalAnimate(true), delay);
			} else setLocalAnimate(true);
		},
		[animation, delay]
	);

	const stopAnimation = useCallback(() => {
		if (delayRef.current) {
			clearTimeout(delayRef.current);
			delayRef.current = null;
		}
		setLocalAnimate(false);
	}, []);

	useEffect(() => {
		if (animate === undefined) return;
		setCurrentAnimation(typeof animate === "string" ? animate : animation);
		if (animate) startAnimation(animate as TriggerProp);
		else stopAnimation();
	}, [animate]);

	useEffect(() => onAnimateChange?.(localAnimate, currentAnimation), [localAnimate, onAnimateChange, currentAnimation]);

	useEffect(() => {
		return () => {
			if (delayRef.current) clearTimeout(delayRef.current);
		};
	}, []);

	const viewOuterRef = useRef<HTMLElement>(null);
	const { ref: inViewRef, isInView } = useIsInView(viewOuterRef, {
		inView: !!animateOnView,
		inViewOnce: animateOnViewOnce,
		inViewMargin: animateOnViewMargin,
	});

	useEffect(() => {
		if (!animateOnView) return;
		if (isInView) startAnimation(animateOnView);
		else stopAnimation();
	}, [isInView, animateOnView, startAnimation, stopAnimation]);

	useEffect(() => {
		async function run() {
			if (!localAnimate) {
				controls.start("initial");
				return;
			}

			onAnimateStart?.();

			try {
				await controls.start("animate");
			} catch {
				return;
			}

			onAnimateEnd?.();

			if (initialOnAnimateEnd || loop) {
				try {
					controls.set("initial");
				} catch {
					return;
				}
			}
			if (loop) {
				if (loopDelay > 0) await new Promise((r) => setTimeout(r, loopDelay));
				await run();
			}
		}

		void run();
	}, [localAnimate, loop, loopDelay, controls, onAnimateStart, onAnimateEnd, initialOnAnimateEnd]);

	const childProps = (isValidElement(children) ? (children as ReactElement).props : {}) as AnyProps;

	const handleMouseEnter = composeEventHandlers<MouseEvent<HTMLElement>>(childProps.onMouseEnter, () => {
		if (animateOnHover) startAnimation(animateOnHover);
	});

	const handleMouseLeave = composeEventHandlers<MouseEvent<HTMLElement>>(childProps.onMouseLeave, () => {
		if (animateOnHover || animateOnTap) stopAnimation();
	});

	const handlePointerDown = composeEventHandlers<PointerEvent<HTMLElement>>(childProps.onPointerDown, () => {
		if (animateOnTap) startAnimation(animateOnTap);
	});

	const handlePointerUp = composeEventHandlers<PointerEvent<HTMLElement>>(childProps.onPointerUp, () => {
		if (animateOnTap) stopAnimation();
	});

	const content = asChild ? (
		<Slot
			ref={inViewRef}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			onPointerDown={handlePointerDown}
			onPointerUp={handlePointerUp}>
			{children as ReactElement}
		</Slot>
	) : (
		<span
			ref={inViewRef}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			onPointerDown={handlePointerDown}
			onPointerUp={handlePointerUp}
			style={{ display: "contents" }}>
			{children}
		</span>
	);

	return (
		<AnimateIconContext.Provider
			value={{
				animation: currentAnimation,
				active: localAnimate,
				initialOnAnimateEnd,
				animateOnViewMargin,
				animateOnViewOnce,
				animateOnHover,
				animateOnView,
				animateOnTap,
				loopDelay,
				controls,
				animate,
				delay,
				loop,
			}}>
			{content}
		</AnimateIconContext.Provider>
	);
}

export const pathClassName = "[&_[stroke-dasharray='1px_1px']]:![stroke-dasharray:1px_0px]";

export function IconWrapper<T extends string>({
	animateOnViewMargin = "0px",
	initialOnAnimateEnd = false,
	animation: animationProp,
	animateOnViewOnce = true,
	animateOnHover = false,
	animateOnView = false,
	animateOnTap = false,
	icon: IconComponent,
	onAnimateChange,
	onAnimateStart,
	loopDelay = 0,
	onAnimateEnd,
	loop = false,
	size = 28,
	delay = 0,
	className,
	animate,
	...props
}: IconWrapperProps<T>): ReactNode {
	const context = useContext(AnimateIconContext);

	if (context) {
		const {
			controls,
			animation: parentAnimation,
			loop: parentLoop,
			loopDelay: parentLoopDelay,
			active: parentActive,
			animate: parentAnimate,
			animateOnHover: parentAnimateOnHover,
			animateOnTap: parentAnimateOnTap,
			animateOnView: parentAnimateOnView,
			animateOnViewMargin: parentAnimateOnViewMargin,
			animateOnViewOnce: parentAnimateOnViewOnce,
			initialOnAnimateEnd: parentInitialOnAnimateEnd,
			delay: parentDelay,
		} = context;

		const hasOverrides =
			animate !== undefined ||
			animationProp !== undefined ||
			animateOnHover !== false ||
			animateOnTap !== false ||
			animateOnView !== false ||
			loop !== false ||
			loopDelay !== 0 ||
			initialOnAnimateEnd !== false ||
			delay !== 0;

		if (hasOverrides) {
			const inheritedAnimate: Trigger = parentActive ? animationProp ?? parentAnimation ?? "default" : false;

			const finalAnimate: Trigger = (animate ?? parentAnimate ?? inheritedAnimate) as Trigger;

			return (
				<AnimateIcon
					animateOnViewMargin={animateOnViewMargin ?? parentAnimateOnViewMargin}
					initialOnAnimateEnd={initialOnAnimateEnd ?? parentInitialOnAnimateEnd}
					animateOnViewOnce={animateOnViewOnce ?? parentAnimateOnViewOnce}
					animateOnHover={animateOnHover ?? parentAnimateOnHover}
					animateOnView={animateOnView ?? parentAnimateOnView}
					animateOnTap={animateOnTap ?? parentAnimateOnTap}
					animation={animationProp ?? parentAnimation}
					loopDelay={loopDelay ?? parentLoopDelay}
					onAnimateChange={onAnimateChange}
					onAnimateStart={onAnimateStart}
					delay={delay ?? parentDelay}
					onAnimateEnd={onAnimateEnd}
					loop={loop ?? parentLoop}
					animate={finalAnimate}
					asChild>
					<IconComponent
						size={size}
						className={cn(
							className,
							((animationProp ?? parentAnimation) === "path" || (animationProp ?? parentAnimation) === "path-loop") && pathClassName
						)}
						{...props}
					/>
				</AnimateIcon>
			);
		}

		const animationToUse = animationProp ?? parentAnimation;
		const loopToUse = parentLoop;
		const loopDelayToUse = parentLoopDelay;

		return (
			<AnimateIconContext.Provider
				value={{
					controls,
					loop: loopToUse,
					delay: parentDelay,
					active: parentActive,
					animate: parentAnimate,
					loopDelay: loopDelayToUse,
					animation: animationToUse,
					animateOnTap: parentAnimateOnTap,
					animateOnView: parentAnimateOnView,
					animateOnHover: parentAnimateOnHover,
					animateOnViewOnce: parentAnimateOnViewOnce,
					initialOnAnimateEnd: parentInitialOnAnimateEnd,
					animateOnViewMargin: parentAnimateOnViewMargin,
				}}>
				<IconComponent
					size={size}
					className={cn(className, (animationToUse === "path" || animationToUse === "path-loop") && pathClassName)}
					{...props}
				/>
			</AnimateIconContext.Provider>
		);
	}

	if (animate !== undefined || onAnimateChange !== undefined || animateOnHover || animateOnTap || animateOnView || animationProp) {
		return (
			<AnimateIcon
				animateOnViewMargin={animateOnViewMargin}
				animateOnViewOnce={animateOnViewOnce}
				onAnimateChange={onAnimateChange}
				animateOnHover={animateOnHover}
				onAnimateStart={onAnimateStart}
				animateOnView={animateOnView}
				onAnimateEnd={onAnimateEnd}
				animateOnTap={animateOnTap}
				animation={animationProp}
				loopDelay={loopDelay}
				animate={animate}
				delay={delay}
				loop={loop}
				asChild>
				<IconComponent
					size={size}
					className={cn(className, (animationProp === "path" || animationProp === "path-loop") && pathClassName)}
					{...props}
				/>
			</AnimateIcon>
		);
	}

	return (
		<IconComponent
			size={size}
			className={cn(className, (animationProp === "path" || animationProp === "path-loop") && pathClassName)}
			{...props}
		/>
	);
}

export function getVariants<V extends { default: T; [key: string]: T }, T extends Record<string, Variants>>(animations: V): T {
	const { animation: animationType } = useAnimateIconContext();

	let result: T;

	if (animationType in staticAnimations) {
		const variant = staticAnimations[animationType as StaticAnimations];
		result = {} as T;
		for (const key in animations.default) {
			if ((animationType === "path" || animationType === "path-loop") && key.includes("group")) continue;
			result[key] = variant as T[Extract<keyof T, string>];
		}
	} else result = (animations[animationType as keyof V] as T) ?? animations.default;

	return result;
}
