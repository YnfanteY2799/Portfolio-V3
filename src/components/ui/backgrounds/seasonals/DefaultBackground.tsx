import { useTheme } from "next-themes";
import { memo, useEffect, useRef } from "react";

export default memo(function DefaultBackground() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const { resolvedTheme } = useTheme();
	const isDark = resolvedTheme === "dark";

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		let animationId: number;
		let isActive = true;
		const stars: Array<{
			x: number;
			y: number;
			length: number;
			speed: number;
			opacity: number;
			angle: number;
		}> = [];
		const maxStars = 12;

		const resize = () => {
			if (!isActive) return;
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};

		const createStar = () => ({
			x: Math.random() * canvas.width * 1.5,
			y: Math.random() * canvas.height * 0.5 - canvas.height * 0.25,
			length: Math.random() * 80 + 40,
			speed: Math.random() * 8 + 4,
			opacity: Math.random() * 0.5 + 0.3,
			angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
		});

		const animate = () => {
			if (!isActive) return;
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			if (stars.length < maxStars && Math.random() < 0.02) {
				stars.push(createStar());
			}

			stars.forEach((star, index) => {
				star.x -= Math.cos(star.angle) * star.speed;
				star.y += Math.sin(star.angle) * star.speed;

				const gradient = ctx.createLinearGradient(
					star.x,
					star.y,
					star.x + Math.cos(star.angle) * star.length,
					star.y - Math.sin(star.angle) * star.length,
				);

				if (isDark) {
					gradient.addColorStop(0, `rgba(120, 200, 160, ${star.opacity})`);
					gradient.addColorStop(0.3, `rgba(100, 180, 200, ${star.opacity * 0.6})`);
					gradient.addColorStop(1, "rgba(100, 180, 200, 0)");
				} else {
					gradient.addColorStop(0, `rgba(50, 130, 90, ${star.opacity})`);
					gradient.addColorStop(0.3, `rgba(40, 120, 140, ${star.opacity * 0.6})`);
					gradient.addColorStop(1, "rgba(40, 120, 140, 0)");
				}

				ctx.beginPath();
				ctx.moveTo(star.x, star.y);
				ctx.lineTo(star.x + Math.cos(star.angle) * star.length, star.y - Math.sin(star.angle) * star.length);
				ctx.strokeStyle = gradient;
				ctx.lineWidth = 1.5;
				ctx.lineCap = "round";
				ctx.stroke();

				ctx.beginPath();
				ctx.arc(star.x, star.y, 2, 0, Math.PI * 2);
				ctx.fillStyle = isDark ? `rgba(255, 255, 255, ${star.opacity})` : `rgba(50, 130, 90, ${star.opacity})`;
				ctx.fill();

				if (star.x < -100 || star.y > canvas.height + 100) {
					stars.splice(index, 1);
				}
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

	return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ opacity: isDark ? 0.6 : 0.4 }} aria-hidden="true" />;
});
