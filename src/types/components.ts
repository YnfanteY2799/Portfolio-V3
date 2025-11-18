import type { ButtonVariantProps } from "@/utils/variants/components.ts";
import type { ComponentProps, CSSProperties, ReactNode } from "react";
import type { Icon } from "@phosphor-icons/react";

export interface IGenericIconSvg {
	size?: number;
	className?: string;
}

/**
 * Props for the BlurOnScroll component.
 */
export interface IBlurOnScrollProps {
	/** The content to be rendered inside the component */
	children: ReactNode;

	/**
	 * The percentage of the element that needs to be visible to trigger the animation.
	 * Value between 0 and 1, where 0 means "as soon as even one pixel is visible" and 1 means
	 * "when the entire element is visible in the viewport"
	 * @default 0.1
	 */
	threshold?: number | number[];

	/**
	 * The intensity of the blur effect in pixels.
	 * Will be automatically reduced on low-end devices.
	 * @default 5
	 */
	blurAmount?: number;

	/**
	 * Duration of the animation in seconds.
	 * Will be automatically reduced on low-end devices or when reduced motion is preferred.
	 * @default 0.4
	 */
	transitionDuration?: number;

	/**
	 * Delay before the animation starts, in seconds.
	 * @default 0
	 */
	delay?: number;

	/**
	 * The direction of the entrance animation.
	 * - "up": Element moves up into position
	 * - "down": Element moves down into position
	 * - "left": Element moves left into position
	 * - "right": Element moves right into position
	 * - "none": No directional movement, only fade and blur
	 * @default "none"
	 */
	direction?: "up" | "down" | "left" | "right" | "none";

	/**
	 * When true, the animation occurs only once when the element first becomes visible.
	 * The element will remain visible even when scrolled out of view.
	 * @default false
	 */
	once?: boolean;

	/**
	 * When true, disables all animations and the element is always visible.
	 * Useful for conditional animation disabling or for users who prefer reduced motion.
	 * @default false
	 */
	disabled?: boolean;

	/**
	 * Additional CSS classes to apply to the component.
	 */
	className?: string;

	/**
	 * Additional inline styles to apply to the component.
	 */
	style?: CSSProperties;

	/**
	 * Callback function that fires when the visibility state changes.
	 * @param isVisible - Whether the element is currently visible in the viewport
	 */
	onVisibilityChange?: (isVisible: boolean) => void;

	/**
	 * Rendering priority of the element.
	 * - "high": Element receives full animation capabilities
	 * - "low": Element uses simplified rendering when offscreen to improve performance
	 * @default "high"
	 */
	priority?: "high" | "low";

	/**
	 * Root margin for the intersection observer
	 * @default "0px"
	 */
	rootMargin?: string;

	/**
	 * Debounce time for intersection observer callbacks in milliseconds
	 * @default 0
	 */
	debounceMs?: number;

	/**
	 * Animation easing function
	 * @default [0.25, 0.1, 0.25, 1.0] (cubic bezier)
	 */
	easing?: number[] | string;

	/**
	 * Distance to move the element during animation in pixels
	 * @default 20
	 */
	distance?: number;

	id?: string;
}

export type CallBackEntryType = { isIntersecting: boolean; intersectionRatio: number; entry: IntersectionObserverEntry };

export interface IAboutCardProps {
	Icon: Icon;
	idx: number;
	title: string;
	gradient: string;
	description: string;
}

export interface IAboutSectionProps {
	attributes?: Array<Omit<IAboutCardProps, "idx">>;
}

export interface ITechCardProps {
	idx: number;
	name: string;
	color: string;
	category: string;
	proficiency: number;
	description: string;
	Icon: string | ReactNode;
}

export interface ITechStackProps {
	technologies?: Array<Omit<ITechCardProps, "idx">>;
}

export interface IButtonProps extends ComponentProps<"button">, ButtonVariantProps {
	disableRipple?: boolean;
	asChild?: boolean;
}
