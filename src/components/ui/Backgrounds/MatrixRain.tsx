"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";

/**
 * Props interface for MatrixRainBackground component
 */
interface MatrixRainBackgroundProps {
	/** Number of character streams to display (default: 30) */
	streamCount?: number;
	/** Animation speed in milliseconds between character updates (default: 100) */
	speed?: number;
	/** Whether dark mode is enabled */
	darkMode?: boolean;
}

/**
 * Individual character in a stream
 */
interface MatrixChar {
	char: string;
	opacity: number;
	glowIntensity: number;
}

/**
 * Stream of falling characters
 */
interface MatrixStream {
	id: number;
	x: number;
	y: number;
	chars: MatrixChar[];
	speed: number;
	lastUpdate: number;
}

/**
 * High-performance Matrix rain background component with optimized rendering
 * Uses requestAnimationFrame for smooth 60fps animations and minimal DOM updates
 */
const MatrixRainBackground: React.FC<MatrixRainBackgroundProps> = ({ streamCount = 30, speed = 100, darkMode = true }) => {
	const [isAnimating, setIsAnimating] = useState(true);
	const [streams, setStreams] = useState<MatrixStream[]>([]);
	const containerRef = useRef<HTMLDivElement>(null);
	const animationRef = useRef<number>(0);
	const lastFrameTime = useRef<number>(0);

	// Character pool for Matrix effect
	const chars = ["0", "1", "O", "°", "●", "○"];

	/**
	 * Generates a random character from the Matrix character set
	 */
	const getRandomChar = useCallback((): string => {
		return chars[Math.floor(Math.random() * chars.length)];
	}, [chars]);

	/**
	 * Creates a new stream with random properties
	 */
	const createStream = useCallback(
		(id: number, containerWidth: number, containerHeight: number): MatrixStream => {
			const streamLength = Math.floor(Math.random() * 20) + 10; // 10-30 characters
			const chars: MatrixChar[] = [];

			// Generate initial characters for the stream
			for (let i = 0; i < streamLength; i++) {
				chars.push({
					char: getRandomChar(),
					opacity: Math.max(0.1, 1 - i / streamLength),
					glowIntensity: Math.max(0.2, 1 - i / streamLength),
				});
			}

			return {
				id,
				x: Math.random() * containerWidth,
				y: Math.random() * -containerHeight, // Start above viewport
				chars,
				speed: Math.random() * 2 + 1, // Random falling speed
				lastUpdate: 0,
			};
		},
		[getRandomChar]
	);

	/**
	 * Initializes streams based on container dimensions
	 */
	const initializeStreams = useCallback(() => {
		if (!containerRef.current) return;

		const rect = containerRef.current.getBoundingClientRect();
		const containerWidth = rect.width;
		const containerHeight = rect.height;

		// Calculate stream count based on screen width for responsiveness
		const dynamicStreamCount = Math.floor(containerWidth / 40); // ~40px per stream
		const finalStreamCount = Math.min(Math.max(streamCount, dynamicStreamCount), 50);

		const newStreams: MatrixStream[] = [];
		for (let i = 0; i < finalStreamCount; i++) {
			newStreams.push(createStream(i, containerWidth, containerHeight));
		}

		setStreams(newStreams);
	}, [streamCount, createStream]);

	/**
	 * Updates stream positions and character mutations
	 */
	const updateStreams = useCallback(
		(currentTime: number) => {
			if (!containerRef.current) return;

			const rect = containerRef.current.getBoundingClientRect();
			const containerHeight = rect.height;
			const containerWidth = rect.width;

			setStreams((prevStreams) =>
				prevStreams.map((stream) => {
					const newY = stream.y + stream.speed;

					// Reset stream if it's completely off screen
					if (newY > containerHeight + stream.chars.length * 20) {
						return createStream(stream.id, containerWidth, containerHeight);
					}

					// Update characters periodically for Matrix drip effect
					let updatedChars = stream.chars;
					if (currentTime - stream.lastUpdate > speed) {
						updatedChars = stream.chars.map((char) => ({
							...char,
							char: Math.random() < 0.1 ? getRandomChar() : char.char, // 10% chance to change
						}));
					}

					return {
						...stream,
						y: newY,
						chars: updatedChars,
						lastUpdate: currentTime - stream.lastUpdate > speed ? currentTime : stream.lastUpdate,
					};
				})
			);
		},
		[speed, createStream, getRandomChar]
	);

	/**
	 * Main animation loop using requestAnimationFrame for optimal performance
	 */
	const animate = useCallback(
		(currentTime: number) => {
			if (currentTime - lastFrameTime.current >= 16.67) {
				// ~60fps throttling
				updateStreams(currentTime);
				lastFrameTime.current = currentTime;
			}

			if (isAnimating) {
				animationRef.current = requestAnimationFrame(animate);
			}
		},
		[isAnimating, updateStreams]
	);

	/**
	 * Toggle animation state
	 */
	const toggleAnimation = useCallback(() => {
		setIsAnimating((prev) => !prev);
	}, []);

	// Initialize streams on mount and window resize
	useEffect(() => {
		initializeStreams();

		const handleResize = () => initializeStreams();
		window.addEventListener("resize", handleResize);

		return () => window.removeEventListener("resize", handleResize);
	}, [initializeStreams]);

	// Start/stop animation loop
	useEffect(() => {
		if (isAnimating) {
			animationRef.current = requestAnimationFrame(animate);
		} else if (animationRef.current) {
			cancelAnimationFrame(animationRef.current);
		}

		return () => {
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
		};
	}, [isAnimating, animate]);

	/**
	 * Renders individual character with appropriate styling based on position and mode
	 */
	const renderChar = (char: MatrixChar, index: number, streamIndex: number, charY: number) => {
		const isTop = index < 3;
		const isBottom = index >= streams[streamIndex]?.chars.length - 3;

		let colorClass = "";
		let glowClass = "";

		if (darkMode) {
			if (isBottom) {
				colorClass = "text-green-300 dark:text-green-300";
				glowClass = "shadow-[0_0_10px_rgba(0,255,0,0.8)] dark:shadow-[0_0_10px_rgba(0,255,0,0.8)]";
			} else if (isTop) {
				colorClass = "text-green-500 dark:text-green-500";
				glowClass = "shadow-[0_0_5px_rgba(0,255,0,0.5)] dark:shadow-[0_0_5px_rgba(0,255,0,0.5)]";
			} else {
				colorClass = Math.random() > 0.5 ? "text-blue-400 dark:text-blue-400" : "text-green-400 dark:text-green-400";
				glowClass = "shadow-[0_0_5px_rgba(0,255,0,0.5)] dark:shadow-[0_0_5px_rgba(0,255,0,0.5)]";
			}
		} else {
			if (isBottom) {
				colorClass = "text-green-500";
				glowClass = "shadow-[0_0_10px_rgba(0,128,0,0.5)]";
			} else if (isTop) {
				colorClass = "text-green-700";
				glowClass = "shadow-[0_0_5px_rgba(0,128,0,0.3)]";
			} else {
				colorClass = Math.random() > 0.5 ? "text-blue-600" : "text-green-600";
				glowClass = "shadow-[0_0_5px_rgba(0,128,0,0.3)]";
			}
		}

		return (
			<div
				key={`${streamIndex}-${index}`}
				className={`absolute font-mono text-sm font-bold transition-all duration-500 ease-in-out ${colorClass} ${glowClass}`}
				style={{
					left: streams[streamIndex]?.x || 0,
					top: charY,
					opacity: char.opacity,
					transform: "translateZ(0)", // GPU acceleration
					willChange: "transform, opacity",
				}}>
				{char.char}
			</div>
		);
	};

	return (
		<div
			ref={containerRef}
			className={`fixed inset-0 overflow-hidden ${
				darkMode
					? "bg-gray-900 dark:bg-gray-900 bg-gradient-to-t from-transparent via-gray-900 to-gray-900 dark:from-transparent dark:via-gray-900 dark:to-gray-900"
					: "bg-gray-100 bg-gradient-to-t from-transparent via-gray-100 to-gray-100"
			}`}
			style={{ zIndex: -1 }}>
			{/* Render all streams and characters */}
			{streams.map((stream, streamIndex) =>
				stream.chars.map((char, charIndex) => {
					const charY = stream.y + charIndex * 20;
					return renderChar(char, charIndex, streamIndex, charY);
				})
			)}

			{/* Control toggle button */}
			<button
				onClick={toggleAnimation}
				className={`fixed top-4 right-4 px-4 py-2 rounded-lg font-medium transition-all duration-200 z-10 ${
					darkMode
						? "bg-gray-800 dark:bg-gray-800 text-white dark:text-white hover:bg-gray-700 dark:hover:bg-gray-700"
						: "bg-gray-300 text-black hover:bg-gray-400"
				}`}>
				{isAnimating ? "Pause" : "Start"} Matrix
			</button>
		</div>
	);
};

// Demo component to showcase the Matrix rain background
const MatrixDemo: React.FC = () => {
	const [darkMode, setDarkMode] = useState(true);

	return (
		<div className={`min-h-screen relative ${darkMode ? "dark" : ""}`}>
			<MatrixRainBackground streamCount={35} speed={120} darkMode={darkMode} />

			{/* Demo content overlay */}
			<div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
				<div className={`text-center p-8 rounded-lg backdrop-blur-sm ${darkMode ? "bg-black/20 text-white" : "bg-white/20 text-black"}`}>
					<h1 className="text-4xl font-bold mb-4">Matrix Rain Background</h1>
					<p className="text-lg mb-6">High-performance animated background component</p>

					<button
						onClick={() => setDarkMode(!darkMode)}
						className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
							darkMode ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"
						}`}>
						Toggle {darkMode ? "Light" : "Dark"} Mode
					</button>
				</div>
			</div>
		</div>
	);
};

export default MatrixDemo;
