import { memo, ReactNode, useEffect, useRef } from "react";
import { useTheme } from "next-themes";

export type TBithdayParticles = {
	type: "confetti" | "gift";
	rotationSpeed: number;
	rotation: number;
	speed: number;
	color: string;
	size: number;
	x: number;
	y: number;
};

export default memo(function BirthdayBackground(): ReactNode {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const { resolvedTheme } = useTheme();
	const isDark = resolvedTheme === "dark";

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const particles: Array<TBithdayParticles> = [];

		let animationId: number;
		let isActive = true;

		const darkColors = ["#ff6b6b", "#4ecdc4", "#ffe66d", "#95e1d3", "#f38181", "#aa96da", "#fcbad3"];
		const lightColors = ["#e53935", "#00897b", "#ffa000", "#43a047", "#d81b60", "#5e35b1", "#ec407a"];
		const colors = isDark ? darkColors : lightColors;

		const resize = () => {
			if (!isActive) return;
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};

		const createParticle = () => ({
			x: Math.random() * canvas.width,
			y: -20,
			rotation: Math.random() * Math.PI * 2,
			rotationSpeed: (Math.random() - 0.5) * 0.1,
			size: Math.random() * 12 + 6,
			speed: Math.random() * 2 + 1,
			color: colors[Math.floor(Math.random() * colors.length)],
			type: Math.random() > 0.9 ? "gift" : ("confetti" as "confetti" | "gift"),
		});

		for (let i = 0; i < 50; i++) {
			const p = createParticle();
			p.y = Math.random() * canvas.height;
			particles.push(p);
		}

		const animate = () => {
			if (!isActive) return;
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			particles.forEach((p, i) => {
				p.y += p.speed;
				p.x += Math.sin(p.y * 0.02) * 0.5;
				p.rotation += p.rotationSpeed;

				if (p.y > canvas.height + 20) {
					particles[i] = createParticle();
				}

				ctx.save();
				ctx.translate(p.x, p.y);
				ctx.rotate(p.rotation);

				if (p.type === "gift") {
					ctx.fillStyle = p.color;
					ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
					ctx.strokeStyle = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.3)";
					ctx.lineWidth = 2;
					ctx.beginPath();
					ctx.moveTo(0, -p.size / 2);
					ctx.lineTo(0, p.size / 2);
					ctx.moveTo(-p.size / 2, 0);
					ctx.lineTo(p.size / 2, 0);
					ctx.stroke();
				} else {
					ctx.fillStyle = p.color;
					ctx.fillRect(-p.size / 2, -p.size / 6, p.size, p.size / 3);
				}

				ctx.restore();
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

	return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.6 }} aria-hidden="true" />;
});
