import { useTheme } from "next-themes";
import { memo, useEffect, useRef } from "react";

export default memo(function NewYearBackground() {
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
		const drips: Array<{
			x: number;
			y: number;
			length: number;
			speed: number;
			hue: number;
			width: number;
			targetLength: number;
		}> = [];

		const resize = () => {
			if (!isActive) return;
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};

		const createDrip = () => ({
			x: Math.random() * canvas.width,
			y: 0,
			length: 0,
			speed: Math.random() * 3 + 2,
			hue: Math.random() * 360,
			width: Math.random() * 4 + 2,
			targetLength: Math.random() * 300 + 100,
		});

		const animate = () => {
			if (!isActive) return;
			const fadeColor = isDark ? "rgba(10, 10, 15, 0.03)" : "rgba(250, 250, 250, 0.03)";
			ctx.fillStyle = fadeColor;
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			if (Math.random() < 0.1) {
				drips.push(createDrip());
			}

			drips.forEach((drip, i) => {
				if (drip.length < drip.targetLength) {
					drip.length += drip.speed;
				} else {
					drip.y += drip.speed;
				}

				const lightness = isDark ? "60%" : "45%";
				const gradient = ctx.createLinearGradient(drip.x, drip.y, drip.x, drip.y + drip.length);
				gradient.addColorStop(0, `hsla(${drip.hue}, 70%, ${lightness}, 0)`);
				gradient.addColorStop(0.5, `hsla(${drip.hue}, 70%, ${lightness}, 0.8)`);
				gradient.addColorStop(1, `hsla(${drip.hue}, 70%, ${lightness}, 1)`);

				ctx.beginPath();
				ctx.moveTo(drip.x, drip.y);
				ctx.lineTo(drip.x, drip.y + drip.length);
				ctx.strokeStyle = gradient;
				ctx.lineWidth = drip.width;
				ctx.lineCap = "round";
				ctx.stroke();

				ctx.beginPath();
				ctx.arc(drip.x, drip.y + drip.length, drip.width + 2, 0, Math.PI * 2);
				ctx.fillStyle = `hsla(${drip.hue}, 80%, ${isDark ? "70%" : "50%"}, 0.8)`;
				ctx.fill();

				if (drip.y > canvas.height) {
					drips.splice(i, 1);
				}
			});

			drips.forEach((drip) => {
				drip.hue = (drip.hue + 0.5) % 360;
			});

			animationId = requestAnimationFrame(animate);
		};

		resize();
		const bgColor = isDark ? "#0a0a0f" : "#fafafa";
		ctx.fillStyle = bgColor;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		window.addEventListener("resize", resize, { passive: true });
		animate();

		return () => {
			isActive = false;
			window.removeEventListener("resize", resize);
			cancelAnimationFrame(animationId);
		};
	}, [isDark]);

	return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" aria-hidden="true" />;
});
