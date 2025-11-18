"use client";

import { buttonVariants } from "@/utils/variants/components.ts";
import { useState, useCallback } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/utils/functions";

import type { IButtonProps } from "@/types/components";
import type { ReactNode, MouseEvent } from "react";

interface RippleType {
	id: number;
	x: number;
	y: number;
}

/**
 * Button component that provides a flexible, accessible clickable element
 * with consistent styling, behavior, and ripple effect.
 *
 * The Button component uses the `buttonVariants` utility for styling and supports
 * polymorphic rendering through Radix UI's Slot component. It can be rendered as
 * any HTML element or component while maintaining button styling and accessibility.
 * Features a material design inspired ripple effect on click.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Button>Click me</Button>
 *
 * // With variants
 * <Button variant="outline" size="sm">Small Outline Button</Button>
 *
 * // As a link
 * <Button asChild>
 *   <Link href="/about">About Page</Link>
 * </Button>
 *
 * // With custom className
 * <Button className="my-custom-class">Custom Button</Button>
 *
 * // With onClick handler
 * <Button onClick={() => console.log('Button clicked')}>Log Click</Button>
 *
 * // Disable ripple effect
 * <Button disableRipple>No Ripple</Button>
 * ```
 *
 * @param props - The component props
 * @param props.className - Additional CSS classes to apply to the button
 * @param props.variant - The visual style variant of the button (e.g., "default", "outline")
 * @param props.size - The size variant of the button (e.g., "default", "sm", "lg")
 * @param props.asChild - When true, button styling is applied to its child component instead
 * @param props.disableRipple - When true, disables the ripple effect
 * @param props.children - The content to render inside the button
 * @returns A button component with the specified styling, behavior, and ripple effect
 */
export default function Button({
	className,
	variant,
	size,
	asChild = false,
	disableRipple = false,
	onClick,
	...props
}: IButtonProps): ReactNode {
	// State
	const [ripples, setRipples] = useState<Array<RippleType>>([]);

	// Component
	const Comp = asChild ? Slot : "button";

	// Callbacks
	const createRipple = useCallback((event: MouseEvent<Element>): void => {
		const button = event.currentTarget;
		const rect = button.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;
		const newRipple: RippleType = { id: Date.now() + Math.random(), x, y };
		setRipples((prev) => [...prev, newRipple]);
		setTimeout(() => setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id)), 600);
	}, []);

	const handleClick = useCallback(
		(event: MouseEvent<HTMLButtonElement>): void => {
			if (!disableRipple) createRipple(event as MouseEvent<Element>);
			onClick?.(event);
		},
		[createRipple, disableRipple, onClick]
	);

	return (
		<Comp
			data-slot="button"
			onClick={handleClick}
			className={cn(buttonVariants({ variant, size, className }), "relative overflow-hidden")}
			{...props}>
			{props.children}

			{/* Ripple container */}
			{!disableRipple && (
				<span className="absolute inset-0 pointer-events-none">
					{ripples.map(({ id, x, y }) => (
						<span
							key={id}
							style={{ left: x - 10, top: y - 10 }}
							className="absolute w-5 h-5 rounded-full bg-current opacity-60 animate-[ripple_0.6s_ease-out] origin-center"
						/>
					))}
				</span>
			)}
		</Comp>
	);
}
