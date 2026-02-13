"use client";
import { type ReactNode, memo, useEffect, useRef } from "react";
import { useTheme } from "next-themes";

export type TSnowflakeObject = {
	opacity: number;
	radius: number;
	speed: number;
	wind: number;
	x: number;
	y: number;
};

export default memo(function ChristmasBackground(): ReactNode {
	// Hooks
	const { resolvedTheme } = useTheme();

	// Ref's
	const canvasRef = useRef<HTMLCanvasElement>(null);

	// Consts
	const isDark = resolvedTheme === "dark";

	// Effects
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const snowflakes: Array<TSnowflakeObject> = [];

		let animationId: number;
		let isActive: boolean = true;

		const resize = () => {
			if (!isActive) return;
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};

		const createSnowflake = (): TSnowflakeObject => ({
			opacity: Math.random() * 0.6 + 0.2,
			wind: Math.random() * 0.5 - 0.25,
			x: Math.random() * canvas.width,
			radius: Math.random() * 3 + 1,
			speed: Math.random() * 2 + 1,
			y: -10,
		});

		for (let i = 0; i < 80; i++) {
			const snowflake = createSnowflake();
			snowflake.y = Math.random() * canvas.height;
			snowflakes.push(snowflake);
		}

		const animate = () => {
			if (!isActive) return;
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			const color = isDark ? "255, 255, 255" : "100, 150, 200";

			snowflakes.forEach((flake, i) => {
				flake.y += flake.speed;
				flake.x += flake.wind + Math.sin(flake.y * 0.01) * 0.5;

				if (flake.y > canvas.height + 10) snowflakes[i] = createSnowflake();

				ctx.beginPath();
				ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
				ctx.fillStyle = `rgba(${color}, ${flake.opacity})`;
				ctx.fill();
			});

			animationId = requestAnimationFrame(animate);
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

	return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ opacity: isDark ? 0.7 : 0.5 }} aria-hidden="true" />;
});
