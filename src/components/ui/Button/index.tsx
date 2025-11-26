import { buttonVariants } from "@/utils/variants/components.ts";
import useRipple from "@/utils/hooks/useRipples";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/utils/functions";
import { useCallback } from "react";

import type { IButtonProps } from "@/types/components";
import type { ReactNode, MouseEvent } from "react";

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
	disableRipple = false,
	isLoading = false,
	asChild = false,
	className,
	variant,
	onClick,
	size,
	...props
}: IButtonProps): ReactNode {
	// Hooks
	const { ripples, createRipple } = useRipple(600);

	// Component
	const Comp = asChild ? Slot : "button";

	// Callbacks
	const handleClick = useCallback(
		(event: MouseEvent<HTMLButtonElement>): void => {
			if (!disableRipple) createRipple(event as MouseEvent<Element>);
			onClick?.(event);
		},
		[createRipple, disableRipple, onClick]
	);

	return (
		<Comp
			className={cn(buttonVariants({ variant, size, className }), "relative overflow-hidden")}
			onClick={handleClick}
			disabled={isLoading}
			data-slot="button"
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
