"use client";
import { m, useMotionValue, useSpring, useTransform } from "motion/react";
import { type ReactNode, type MouseEvent, type ElementType, type ComponentPropsWithoutRef, useRef, useState, useCallback, useMemo } from "react";
import { cn } from "@/utils/functions";

// Polymorphic type utilities (unchanged)
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
	children: ReactNode;
	className?: string;
	containerClassName?: string;
	tiltMaxAngle?: number;
	tiltReverse?: boolean;
	scale?: number;
	glareEnable?: boolean;
	glareMaxOpacity?: number;
	glareColor?: string;
	shadowEnable?: boolean;
	rippleColor?: string;
	rippleDuration?: number;
	borderRadius?: string;
	onClick?: () => void;
	disabled?: boolean;
}

export type TiltCardProps<C extends ElementType = "div"> = PolymorphicComponentPropWithRef<C, TiltCardOwnProps>;

interface RippleEffect {
	x: number;
	y: number;
	id: number;
}

const DEFAULT_ELEMENT = "div" as const;

export default function TiltCard<C extends ElementType = typeof DEFAULT_ELEMENT>({
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
	rippleColor = "rgba(255, 255, 255, 0.6)",
	rippleDuration = 600,
	borderRadius = "var(--radius-lg)",
	onClick,
	disabled = false,
	ref,
	...restProps
}: TiltCardProps<C>): ReactNode {
	const Component = as || DEFAULT_ELEMENT;
	const internalRef = useRef<HTMLElement>(null);
	const [ripples, setRipples] = useState<RippleEffect[]>([]);

	// Motion values
	const x = useMotionValue(0);
	const y = useMotionValue(0);

	const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
	const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

	// FIX: useTransform must be called at top level — no longer inside useMemo!
	const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], tiltReverse ? [tiltMaxAngle, -tiltMaxAngle] : [-tiltMaxAngle, tiltMaxAngle]);

	const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], tiltReverse ? [-tiltMaxAngle, tiltMaxAngle] : [tiltMaxAngle, -tiltMaxAngle]);

	const glareX = useTransform(mouseXSpring, [-0.5, 0.5], [0, 100]);
	const glareY = useTransform(mouseYSpring, [-0.5, 0.5], [0, 100]);

	const handleMouseMove = useCallback(
		(e: MouseEvent<HTMLElement>) => {
			if (disabled || !internalRef.current) return;

			const rect = internalRef.current.getBoundingClientRect();
			const xPct = (e.clientX - rect.left) / rect.width - 0.5;
			const yPct = (e.clientY - rect.top) / rect.height - 0.5;

			x.set(xPct);
			y.set(yPct);
		},
		[disabled, x, y]
	);

	const handleMouseLeave = useCallback(() => {
		x.set(0);
		y.set(0);
	}, [x, y]);

	const handleClick = useCallback(
		(e: MouseEvent<HTMLElement>) => {
			if (disabled) return;

			const rect = e.currentTarget.getBoundingClientRect();
			const newRipple: RippleEffect = {
				x: e.clientX - rect.left,
				y: e.clientY - rect.top,
				id: Date.now(),
			};

			setRipples((prev) => [...prev, newRipple]);

			setTimeout(() => {
				setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
			}, rippleDuration);
		},
		[disabled, rippleDuration]
	);

	const onClickCombined = useCallback(
		(e: MouseEvent<HTMLElement>) => {
			handleClick(e);
			onClick?.();
		},
		[handleClick, onClick]
	);

	return (
		<div className={cn("inline-block perspective-[1000px]", containerClassName)}>
			<m.div
				{...restProps}
				ref={(node) => {
					internalRef.current = node;
					if (typeof ref === "function") {
						ref(node);
					} else if (ref) {
						ref.current = node;
					}
				}}
				onMouseMove={handleMouseMove}
				onMouseLeave={handleMouseLeave}
				onClick={onClickCombined}
				style={{
					rotateX,
					rotateY,
					transformStyle: "preserve-3d",
					borderRadius,
				}}
				whileHover={disabled ? undefined : { scale }}
				whileTap={disabled ? undefined : { scale: scale * 0.95 }}
				transition={{ type: "spring", stiffness: 260, damping: 20 }}
				className={cn(
					"relative overflow-hidden",
					shadowEnable && "shadow-lg hover:shadow-2xl transition-shadow duration-300",
					!disabled && "cursor-pointer",
					disabled && "opacity-50 cursor-not-allowed",
					className
				)}>
				{/* Content */}
				<Component className="relative z-10" style={{ transform: "translateZ(20px)" }}>
					{children}
				</Component>

				{/* Glare effect */}
				{glareEnable && !disabled && (
					<m.div
						className="absolute inset-0 pointer-events-none z-20"
						style={{
							background: `radial-gradient(circle at ${glareX}% ${glareY}%, ${glareColor} 0%, transparent 70%)`,
							opacity: glareMaxOpacity,
							mixBlendMode: "overlay",
							borderRadius,
						}}
					/>
				)}

				{/* Ripple effects */}
				{ripples.map(({ x, y, id }) => (
					<m.span
						key={id}
						initial={{ width: 0, height: 0, opacity: 1 }}
						animate={{ width: 500, height: 500, opacity: 0 }}
						className="absolute z-30 pointer-events-none rounded-full"
						transition={{ duration: rippleDuration / 1000, ease: "easeOut" }}
						style={{
							left: x,
							top: y,
							background: rippleColor,
							transform: "translate(-50%, -50%)",
						}}
					/>
				))}
			</m.div>
		</div>
	);
}
