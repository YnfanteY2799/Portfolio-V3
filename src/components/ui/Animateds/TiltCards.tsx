"use client";
import { m, useMotionValue, useSpring, useTransform, useMotionTemplate } from "motion/react";
import useMergeRefs from "@/utils/hooks/useMergeRefs";
import useRipple from "@/utils/hooks/useRipples";
import { useRef, useCallback } from "react";
import { cn } from "@/utils/functions";

import type { ReactNode, MouseEvent, ElementType, ComponentPropsWithoutRef, KeyboardEvent } from "react";

type AsProp<C extends ElementType> = {
	as?: C;
};

type PropsToOmit<C extends ElementType, P> = keyof (AsProp<C> & P);

type PolymorphicComponentProp<C extends ElementType, Props = object> = Props &
	AsProp<C> &
	Omit<ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;

type PolymorphicRef<C extends ElementType> = ComponentPropsWithoutRef<C>["ref"];

type PolymorphicComponentPropWithRef<C extends ElementType, Props = object> = PolymorphicComponentProp<C, Props> & {
	ref?: PolymorphicRef<C>;
};

// Component props
interface TiltCardOwnProps {
	containerClassName?: string;
	glareMaxOpacity?: number;
	disableRipple?: boolean;
	rippleDuration?: number;
	shadowEnable?: boolean;
	glareEnable?: boolean;
	tiltReverse?: boolean;
	tiltMaxAngle?: number;
	borderRadius?: string;
	rippleColor?: string;
	onClick?: () => void;
	glareColor?: string;
	children: ReactNode;
	className?: string;
	disabled?: boolean;
	scale?: number;
}

export type TiltCardProps<C extends ElementType = "div"> = PolymorphicComponentPropWithRef<C, TiltCardOwnProps>;

export default function TiltCard<C extends ElementType = "div">({
	as,
	children,
	className,
	containerClassName,
	tiltMaxAngle = 15,
	tiltReverse = false,
	scale = 1.05,
	glareEnable = true,
	glareMaxOpacity = 0.3,
	glareColor = "#ffffff",
	shadowEnable = true,
	disableRipple = false,
	rippleColor = "rgba(255, 255, 255, 0.6)",
	rippleDuration = 600,
	borderRadius = "var(--radius-lg)",
	onClick,
	disabled = false,
	ref,
	...restProps
}: TiltCardProps<C>): ReactNode {
	const Component = as || "div";
	const internalRef = useRef<HTMLElement>(null);

	const { ripples, createRipple } = useRipple(600);

	const mergedRefs = useMergeRefs(internalRef, ref);

	// Motion values
	const x = useMotionValue(0);
	const y = useMotionValue(0);

	const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
	const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

	// Transform values for rotation
	const rotateX = useTransform(
		mouseYSpring,
		[-0.5, 0.5],
		tiltReverse ? [`${tiltMaxAngle}deg`, `-${tiltMaxAngle}deg`] : [`-${tiltMaxAngle}deg`, `${tiltMaxAngle}deg`]
	);

	const rotateY = useTransform(
		mouseXSpring,
		[-0.5, 0.5],
		tiltReverse ? [`-${tiltMaxAngle}deg`, `${tiltMaxAngle}deg`] : [`${tiltMaxAngle}deg`, `-${tiltMaxAngle}deg`]
	);

	// Glare position values
	const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
	const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

	// Glare background using useMotionTemplate
	const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, ${glareColor} 0%, transparent 70%)`;

	const handleMouseMove = useCallback(
		({ clientX, clientY }: MouseEvent<HTMLElement>) => {
			if (disabled || !internalRef.current) return;
			const rect = internalRef.current.getBoundingClientRect();
			const xPct = (clientX - rect.left) / rect.width - 0.5;
			const yPct = (clientY - rect.top) / rect.height - 0.5;
			x.set(xPct);
			y.set(yPct);
		},
		[disabled, x, y]
	);

	const handleMouseLeave = useCallback(() => {
		x.set(0);
		y.set(0);
	}, [x, y]);

	const onClickCombined = useCallback(
		(e: MouseEvent<HTMLElement>) => {
			if (!disableRipple) createRipple(e as MouseEvent<Element>);
			onClick?.();
		},
		[onClick]
	);

	// Keyboard accessibility
	const handleKeyDown = useCallback(
		(e: KeyboardEvent<HTMLElement>) => {
			if (disabled) return;
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				onClick?.();
			}
		},
		[disabled, onClick]
	);

	return (
		<div className={cn("inline-block [perspective:1000px]", containerClassName)}>
			<m.div
				{...restProps}
				ref={mergedRefs}
				onClick={onClickCombined}
				onKeyDown={handleKeyDown}
				onMouseMove={handleMouseMove}
				onMouseLeave={handleMouseLeave}
				role={onClick ? "button" : undefined}
				style={{ rotateX, rotateY, borderRadius }}
				whileHover={disabled ? undefined : { scale }}
				tabIndex={onClick && !disabled ? 0 : undefined}
				whileTap={disabled ? undefined : { scale: scale * 0.95 }}
				transition={{ type: "spring", stiffness: 260, damping: 20 }}
				className={cn(
					"relative overflow-hidden [transform-style:preserve-3d]",
					shadowEnable && "shadow-lg hover:shadow-2xl transition-shadow duration-300",
					disabled && "opacity-50 cursor-not-allowed",
					!disabled && "cursor-pointer",
					className
				)}>
				{/* Content */}
				<Component className="relative z-10 [transform:translateZ(20px)]">{children}</Component>

				{/* Glare effect */}
				{glareEnable && !disabled && (
					<m.div
						className="absolute inset-0 pointer-events-none z-20 mix-blend-overlay"
						style={{ background: glareBackground, opacity: glareMaxOpacity, borderRadius }}
					/>
				)}

				{/* Ripple effects */}
				{ripples.map(({ x: left, y: top, id }) => (
					<m.span
						key={id}
						initial={{ width: 0, height: 0, opacity: 1 }}
						style={{ left, top, background: rippleColor }}
						animate={{ width: 500, height: 500, opacity: 0 }}
						transition={{ duration: rippleDuration / 1000, ease: "easeOut" }}
						className="absolute z-30 pointer-events-none rounded-full -translate-x-1/2 -translate-y-1/2"
					/>
				))}
			</m.div>
		</div>
	);
}
