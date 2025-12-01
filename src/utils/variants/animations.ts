import type { Transition, Variants } from "motion/react";

export const TestimonialsTransitionVariants: Transition = {
	x: { type: "spring", stiffness: 300, damping: 30 },
	rotateY: { duration: 0.4 },
	opacity: { duration: 0.2 },
	scale: { duration: 0.4 },
};

export const TestimonialsSlideVariants: Variants = {
	exit: (d: number) => ({ zIndex: 0, opacity: 0, scale: 0.8, x: d < 0 ? 1000 : -1000, rotateY: d < 0 ? 45 : -45 }),
	enter: (d: number) => ({ x: d > 0 ? 1000 : -1000, opacity: 0, scale: 0.8, rotateY: d > 0 ? 45 : -45 }),
	center: { zIndex: 1, x: 0, opacity: 1, scale: 1, rotateY: 0 },
};
