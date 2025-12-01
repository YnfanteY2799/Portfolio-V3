"use client";
import { getVariants, useAnimateIconContext, IconWrapper, type IconProps } from "../base.tsx";
import { m as motion, type Variants } from "motion/react";

import type { ReactNode } from "react";

export type MoonStarProps = IconProps<keyof typeof animations>;

const animations = {
	default: {
		path1: {
			initial: {
				rotate: 0,
				transition: { duration: 0 },
			},
			animate: {
				rotate: [0, -30, 400, 360],
				transition: {
					duration: 1.2,
					times: [0, 0.25, 0.75, 1],
					ease: ["easeInOut", "easeInOut", "easeInOut"],
				},
			},
		},
		group: {
			initial: {
				scale: 1,
				rotate: 0,
				y: 0,
				x: 0,
			},
			animate: {
				scale: [1, 0, 0, 1],
				rotate: [0, 90, 90, 0],
				y: [0, 6, 10, 0],
				x: [0, -10, -6, 0],
				transition: {
					duration: 1.2,
					ease: "easeInOut",
					times: [0, 0.25, 0.65, 1],
				},
			},
		},
		path2: {},
		path3: {},
	} satisfies Record<string, Variants>,
} as const;

function IconComponent({ size, ...props }: MoonStarProps): ReactNode {
	const { controls } = useAnimateIconContext();
	const { path1, group, path2, path3 } = getVariants(animations);

	return (
		<motion.svg
			fill="none"
			width={size}
			height={size}
			strokeWidth={2}
			initial="initial"
			animate={controls}
			viewBox="0 0 24 24"
			strokeLinecap="round"
			stroke="currentColor"
			strokeLinejoin="round"
			xmlns="http://www.w3.org/2000/svg"
			{...props}>
			<motion.path
				d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"
				variants={path1}
				animate={controls}
				initial="initial"
			/>
			<motion.g variants={group} initial="initial" animate={controls}>
				<motion.path d="M18 5h4" variants={path2} initial="initial" animate={controls} />
				<motion.path d="M20 3v4" variants={path3} initial="initial" animate={controls} />
			</motion.g>
		</motion.svg>
	);
}

export default function MoonStarIcon(props: MoonStarProps) {
	return <IconWrapper icon={IconComponent} {...props} />;
}
