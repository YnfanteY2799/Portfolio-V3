"use client";
import { useEffect, useRef, memo, type ReactNode, useMemo, lazy } from "react";
import useHasBeenMounted from "@/utils/hooks/useHasBeenMounted";
import { useTheme } from "next-themes";

const ChristmasBackground = lazy(() => import("./seasonals/ChristmasBackground"));
const BirthdayBackground = lazy(() => import("./seasonals/BirthdayBackground"));
const NewYearBackground = lazy(() => import("./seasonals/NewYearkBackground"));
const DefaultBackground = lazy(() => import("./seasonals/DefaultBackground"));

export type TDirpParticles = TSimpleGraphPoints & { targetLength: number; length: number; width: number; hue: number };
export type TSnowflakeObject = TSimpleGraphPoints & { opacity: number; radius: number; wind: number };
export type TStarts = TSimpleGraphPoints & { opacity: number; length: number; angle: number };
export type SeasonalType = "default" | "christmas" | "birthday" | "newyear";
export type TSimpleGraphPoints = { x: number; y: number; speed: number };
export type BithParticlesType = "confetti" | "gift";
export type TBithdayParticles = TSimpleGraphPoints & {
	type: BithParticlesType;
	rotationSpeed: number;
	rotation: number;
	color: string;
	size: number;
};

type TCommonParticle = TStarts | TDirpParticles | TSnowflakeObject | TBithdayParticles;

const LIGHT_COLORS: ReadonlyArray<string> = ["#e53935", "#00897b", "#ffa000", "#43a047", "#d81b60", "#5e35b1", "#ec407a"];
const DARK_COLORS: ReadonlyArray<string> = ["#ff6b6b", "#4ecdc4", "#ffe66d", "#95e1d3", "#f38181", "#aa96da", "#fcbad3"];

function getSeasonalType(): SeasonalType {
	const today = new Date();
	const day = today.getDate();
	const month = today.getMonth() + 1;

	// Christmas: December 24-26
	if (month === 12 && day >= 24 && day <= 26) return "christmas";

	// Birthday: Sept 27
	if (month === 9 && day === 27) return "birthday";

	// New Year: December 31 - January 2
	if ((month === 12 && day === 31) || (month === 1 && day <= 2)) return "newyear";

	return "default";
}

export const SeasonalBackground = memo(function SeasonalBackground() {
	const hasBeenMounted = useHasBeenMounted();

	const currentSeason = useMemo(() => getSeasonalType(), []);

	if (!hasBeenMounted) return null;

	switch (currentSeason) {
		case "christmas":
			return <ChristmasBackground />;
		case "birthday":
			return <BirthdayBackground />;
		case "newyear":
			return <NewYearBackground />;
		default:
			return <DefaultBackground />;
	}
});

export default memo(function SeasonalBackground(): ReactNode {
	// Hooks
	const { resolvedTheme } = useTheme();

	// Ref's
	const canvasRef = useRef<HTMLCanvasElement>(null);

	// Const's
	const isDark = resolvedTheme === "dark";

	// Memo's
	const currentSeason = useMemo(() => getSeasonalType(), []);
	const BITHDAY_COLORS = useMemo(() => (isDark ? DARK_COLORS : LIGHT_COLORS), [isDark]);

	// Functions
	function createParticleBasedOnType(): TCommonParticle {
		const canvas = canvasRef.current!;

		switch (currentSeason) {
			case "birthday":
				return {
					type: Math.random() > 0.9 ? "gift" : ("confetti" as "confetti" | "gift"),
					color: BITHDAY_COLORS[Math.floor(Math.random() * BITHDAY_COLORS.length)],
					rotationSpeed: (Math.random() - 0.5) * 0.1,
					rotation: Math.random() * Math.PI * 2,
					x: Math.random() * canvas.width,
					size: Math.random() * 12 + 6,
					speed: Math.random() * 2 + 1,
					y: -20,
				};
			case "christmas":
				return {
					opacity: Math.random() * 0.6 + 0.2,
					wind: Math.random() * 0.5 - 0.25,
					x: Math.random() * canvas.width,
					radius: Math.random() * 3 + 1,
					speed: Math.random() * 2 + 1,
					y: -10,
				};
			case "newyear":
				return {
					targetLength: Math.random() * 300 + 100,
					x: Math.random() * canvas.width,
					speed: Math.random() * 3 + 2,
					width: Math.random() * 4 + 2,
					hue: Math.random() * 360,
					length: 0,
					y: 0,
				};
			default:
				return {
					y: Math.random() * canvas.height * 0.5 - canvas.height * 0.25,
					angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
					x: Math.random() * canvas.width * 1.5,
					opacity: Math.random() * 0.5 + 0.3,
					length: Math.random() * 80 + 40,
					speed: Math.random() * 8 + 4,
				};
		}
	}

	// Effects
	useEffect(() => {
		const background_items: Array<TCommonParticle> = [];
		let isActive: boolean = false;
		let animationId: number;

		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const resize = (): void => {
			if (!isActive) return;
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};

		for (let i = 0; i < 80; i++) {
			const item = createParticleBasedOnType();
			item.y = Math.random() * canvas.height;
			background_items.push(item);
		}

		const animate = () => {
			if (!isActive) return;
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			animationId = 0;
		};

		resize();
		window.addEventListener("resize", resize, { passive: true });
		animate();

		return () => {
			isActive = false;
			window.removeEventListener("resize", resize);
			cancelAnimationFrame(animationId);
		};
	}, [isDark]);

	return <></>;
});
