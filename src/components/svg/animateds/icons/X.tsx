"use client";
import { getVariants, useAnimateIconContext, IconWrapper, type IconProps } from "../base.tsx";
import { m as motion, type Variants } from "motion/react";
import { memo, ReactNode } from "react";

export type XProps = IconProps<keyof typeof animations>;

const animations = {
	default: {
		line1: {
			initial: {
				rotate: 0,
				transition: { ease: "easeInOut", duration: 0.4 },
			},
			animate: {
				rotate: 90,
				transition: { ease: "easeInOut", duration: 0.4 },
			},
		},
		line2: {
			initial: {
				rotate: 0,
				transition: { ease: "easeInOut", duration: 0.4, delay: 0.1 },
			},
			animate: {
				rotate: 90,
				transition: { ease: "easeInOut", duration: 0.4, delay: 0.1 },
			},
		},
	} satisfies Record<string, Variants>,
	plus: {
		line1: {
			initial: {
				rotate: 0,
				x1: 6,
				y1: 18,
				x2: 18,
				y2: 6,
				transition: { ease: "easeInOut", duration: 0.3, delay: 0.1 },
			},
			animate: {
				rotate: 45,
				x1: 7.1,
				y1: 16.9,
				x2: 16.9,
				y2: 7.1,
				transition: { ease: "easeInOut", duration: 0.3, delay: 0.1 },
			},
		},
		line2: {
			initial: {
				rotate: 0,
				x1: 6,
				y1: 6,
				x2: 18,
				y2: 18,
				transition: { ease: "easeInOut", duration: 0.3 },
			},
			animate: {
				rotate: 45,
				x1: 7.1,
				y1: 7.1,
				x2: 16.9,
				y2: 16.9,
				transition: { ease: "easeInOut", duration: 0.3 },
			},
		},
	} satisfies Record<string, Variants>,
} as const;

function IconComponent({ size, ...props }: XProps): ReactNode {
	const { controls } = useAnimateIconContext();
	const variants = getVariants(animations);

	return (
		<motion.svg
			fill="none"
			width={size}
			height={size}
			strokeWidth={2}
			viewBox="0 0 24 24"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			xmlns="http://www.w3.org/2000/svg"
			{...props}>
			<motion.line x1={6} y1={18} x2={18} y2={6} variants={variants.line1} initial="initial" animate={controls} />
			<motion.line x1={6} y1={6} x2={18} y2={18} variants={variants.line2} initial="initial" animate={controls} />
		</motion.svg>
	);
}

export default memo(function X(props: XProps): ReactNode {
	return <IconWrapper icon={IconComponent} {...props} />;
});
