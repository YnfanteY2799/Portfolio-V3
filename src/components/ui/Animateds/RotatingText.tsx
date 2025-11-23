"use client";

import { m, AnimatePresence, type Transition, type VariantLabels, type Target, type TargetAndTransition, type MotionProps } from "motion/react";
import { ComponentPropsWithoutRef, ElementType, useCallback, useEffect, useImperativeHandle, useMemo, useState, type Ref } from "react";
import { cn } from "@/utils/functions";

export interface RotatingTextRef {
	jumpTo: (index: number) => void;
	previous: () => void;
	reset: () => void;
	next: () => void;
}

export type TMergedMotion<C extends ElementType> = Omit<
	MotionProps & ComponentPropsWithoutRef<C>,
	"children" | "initial" | "animate" | "exit" | "transition"
>;

export type TRotatingTextProps<C extends ElementType = "span"> = TMergedMotion<C> & {
	as?: C;
	ref?: Ref<RotatingTextRef>;
	texts: string[];
	transition?: Transition;
	initial?: boolean | Target | VariantLabels;
	animate?: boolean | VariantLabels | TargetAndTransition;
	exit?: Target | VariantLabels;
	animatePresenceMode?: "sync" | "wait";
	animatePresenceInitial?: boolean;
	rotationInterval?: number;
	staggerDuration?: number;
	staggerFrom?: "first" | "last" | "center" | "random" | number;
	loop?: boolean;
	auto?: boolean;
	splitBy?: "characters" | "words" | "lines" | string;
	onNext?: (index: number) => void;
	mainClassName?: string;
	splitLevelClassName?: string;
	elementLevelClassName?: string;
};

export default function RotatingText<C extends ElementType = "span">(
	{
		as: Component = "span" as C,
		ref,
		texts,
		transition = { type: "spring", damping: 25, stiffness: 300 },
		initial = { y: "100%", opacity: 0 },
		animate = { y: 0, opacity: 1 },
		exit = { y: "-120%", opacity: 0 },
		animatePresenceMode = "wait",
		animatePresenceInitial = false,
		rotationInterval = 2000,
		staggerDuration = 0,
		staggerFrom = "first",
		loop = true,
		auto = true,
		splitBy = "characters",
		onNext,
		mainClassName,
		splitLevelClassName,
		elementLevelClassName,
		...rest
	}: TRotatingTextProps<C>,
	externalRef?: Ref<RotatingTextRef>
) {
	const [currentTextIndex, setCurrentTextIndex] = useState(0);

	// Merge external ref with internal imperative handle
	useImperativeHandle(externalRef ?? ref, () => ({ next, previous, jumpTo, reset }), []);

	const splitIntoGraphemes = useCallback((text: string): string[] => {
		if (typeof Intl !== "undefined" && Intl.Segmenter) {
			const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
			return Array.from(segmenter.segment(text), (s) => s.segment);
		}
		return Array.from(text);
	}, []);

	const elements = useMemo(() => {
		const text = texts[currentTextIndex] ?? "";
		const delimiter = splitBy === "characters" ? " " : splitBy === "words" ? " " : splitBy === "lines" ? "\n" : splitBy;

		const parts = splitBy === "characters" ? text.split(" ") : text.split(delimiter);

		return parts.map((part, i) => ({
			characters: splitBy === "characters" ? splitIntoGraphemes(part) : [part],
			needsSpace: i < parts.length - 1,
		}));
	}, [texts, currentTextIndex, splitBy, splitIntoGraphemes]);

	const totalChars = useMemo(() => elements.reduce((sum, { characters }) => sum + characters.length, 0), [elements]);

	const getDelay = useCallback(
		(index: number) => {
			if (staggerFrom === "first") return index * staggerDuration;
			if (staggerFrom === "last") return (totalChars - 1 - index) * staggerDuration;
			if (staggerFrom === "center") return Math.abs(Math.floor(totalChars / 2) - index) * staggerDuration;
			if (staggerFrom === "random") return Math.abs(Math.floor(Math.random() * totalChars) - index) * staggerDuration;
			return Math.abs((staggerFrom as number) - index) * staggerDuration;
		},
		[staggerDuration, staggerFrom, totalChars]
	);

	const goTo = useCallback(
		(index: number) => {
			const clamped = Math.max(0, Math.min(index, texts.length - 1));
			if (clamped !== currentTextIndex) {
				setCurrentTextIndex(clamped);
				onNext?.(clamped);
			}
		},
		[currentTextIndex, texts.length, onNext]
	);

	const next = useCallback(
		() => goTo(currentTextIndex + 1 >= texts.length ? (loop ? 0 : currentTextIndex) : currentTextIndex + 1),
		[currentTextIndex, texts.length, loop, goTo]
	);
	const previous = useCallback(
		() => goTo(currentTextIndex <= 0 ? (loop ? texts.length - 1 : 0) : currentTextIndex - 1),
		[currentTextIndex, texts.length, loop, goTo]
	);
	const jumpTo = useCallback((i: number) => goTo(i), [goTo]);
	const reset = useCallback(() => goTo(0), [goTo]);

	useImperativeHandle(externalRef ?? ref, () => ({ next, previous, jumpTo, reset }), [next, previous, jumpTo, reset]);

	useEffect(() => {
		if (!auto) return;
		const id = setInterval(next, rotationInterval);
		return () => clearInterval(id);
	}, [auto, rotationInterval, next]);

	const MotionWrapper = m.create(Component);

	return (
		<MotionWrapper className={cn("relative flex flex-wrap whitespace-pre-wrap", mainClassName)} layout transition={transition} {...rest}>
			<span className="sr-only">{texts[currentTextIndex]}</span>

			<AnimatePresence mode={animatePresenceMode} initial={animatePresenceInitial}>
				<m.span
					layout
					aria-hidden="true"
					key={currentTextIndex}
					className={cn(splitBy === "lines" ? "flex w-full flex-col" : "relative flex flex-wrap whitespace-pre-wrap")}>
					{(() => {
						let charOffset = 0;
						return elements.map(({ characters, needsSpace }, wordIdx) => {
							const start = charOffset;
							charOffset += characters.length;

							return (
								<span key={wordIdx} className={cn("inline-flex", splitLevelClassName)}>
									{characters.map((char, i) => (
										<m.span
											key={i}
											initial={initial}
											animate={animate}
											exit={exit}
											transition={{ ...transition, delay: getDelay(start + i) }}
											className={cn("inline-block", elementLevelClassName)}>
											{char}
										</m.span>
									))}
									{needsSpace && " "}
								</span>
							);
						});
					})()}
				</m.span>
			</AnimatePresence>
		</MotionWrapper>
	);
}
