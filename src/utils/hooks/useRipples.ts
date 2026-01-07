import { type MouseEvent, type TouchEvent, useCallback, useEffect, useRef, useState } from "react";

import type { UseRippleOptions, UseRippleReturn, RippleType } from "@/types/hooks";

/**
 * Custom React hook for creating Material Design ripple effects.
 *
 * Provides a complete ripple effect system with automatic cleanup, position
 * calculation, and size scaling. Supports both mouse and touch interactions.
 *
 * **Features:**
 * - Automatic ripple removal after animation duration
 * - Max ripples limit to prevent memory buildup
 * - Touch and mouse event support
 * - Precise positioning based on click/touch location
 * - Scales to cover entire element
 *
 * @param options - Configuration options for ripple behavior
 * @returns Object containing ripple state and control functions
 *
 * @example
 * // Basic usage
 * function RippleButton() {
 *   const { ripples, createRipple } = useRipple();
 *
 *   return (
 *     <button
 *       onMouseDown={createRipple}
 *       style={{ position: 'relative', overflow: 'hidden' }}
 *     >
 *       Click me
 *       {ripples.map(ripple => (
 *         <span
 *           key={ripple.key}
 *           className="ripple"
 *           style={{
 *             position: 'absolute',
 *             left: ripple.x,
 *             top: ripple.y,
 *             width: ripple.size,
 *             height: ripple.size,
 *             borderRadius: '50%',
 *             background: 'rgba(255, 255, 255, 0.6)',
 *             transform: 'scale(0)',
 *             animation: 'ripple-animation 600ms ease-out'
 *           }}
 *         />
 *       ))}
 *     </button>
 *   );
 * }
 *
 * @example
 * // With custom duration and max ripples
 * const { ripples, createRipple } = useRipple({
 *   duration: 800,
 *   maxRipples: 5
 * });
 *
 * @example
 * // With manual cleanup using onAnimationEnd
 * const { ripples, createRipple, clearRipple } = useRipple({
 *   duration: 0 // Disable auto-removal
 * });
 *
 * return (
 *   <button onMouseDown={createRipple}>
 *     {ripples.map(ripple => (
 *       <span
 *         key={ripple.key}
 *         onAnimationEnd={() => clearRipple(ripple.key)}
 *         style={{ animation: 'ripple 600ms' }}
 *       />
 *     ))}
 *   </button>
 * );
 *
 * @example
 * // Conditional ripples
 * const [enabled, setEnabled] = useState(true);
 * const { ripples, createRipple } = useRipple({
 *   disabled: !enabled
 * });
 *
 * @example
 * // With CSS animation
 * // CSS:
 * // @keyframes ripple-animation {
 * //   from { transform: scale(0); opacity: 1; }
 * //   to { transform: scale(1); opacity: 0; }
 * // }
 */
export default function useRipple(options: UseRippleOptions = {}): UseRippleReturn {
	// Props
	const { disabled = false, duration = 600, maxRipples = 3, enableHapticFeedback = false } = options;

	// Ref's
	const timeoutRefs = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());
	const rippleKeyRef = useRef(0);

	// State
	const [ripples, setRipples] = useState<Array<RippleType>>([]);

	const clearRipple = useCallback((key: number) => {
		setRipples((prev) => prev.filter((ripple) => ripple.key !== key));

		// Clear associated timeout
		const timeout = timeoutRefs.current.get(key);
		if (timeout) {
			clearTimeout(timeout);
			timeoutRefs.current.delete(key);
		}
	}, []);

	const clearAllRipples = useCallback(() => {
		setRipples(() => []);

		// Clear all timeouts
		timeoutRefs.current.forEach((timeout) => clearTimeout(timeout));
		timeoutRefs.current.clear();
	}, []);

	const createRipple = useCallback(
		(event: MouseEvent<HTMLElement> | TouchEvent<HTMLElement>) => {
			if (disabled) return;

			const element = event.currentTarget;
			const rect = element.getBoundingClientRect();

			// Get click/touch position
			let clientX: number;
			let clientY: number;

			if ("touches" in event) {
				// Handle case where touches might be empty
				if (event.touches.length === 0) return;
				clientX = event.touches[0].clientX;
				clientY = event.touches[0].clientY;
			} else {
				clientX = event.clientX;
				clientY = event.clientY;
			}

			// Calculate position relative to element
			const x = clientX - rect.left;
			const y = clientY - rect.top;

			// Calculate size to ensure ripple covers entire element
			const size = Math.max(rect.width, rect.height) * 2;

			// Trigger haptic feedback
			if (enableHapticFeedback && navigator.vibrate) navigator.vibrate(3);

			// Generate unique key (use modulo to prevent overflow)
			const key = rippleKeyRef.current;
			rippleKeyRef.current = (rippleKeyRef.current + 1) % Number.MAX_SAFE_INTEGER;

			const newRipple: RippleType = {
				key,
				x: x - size / 2,
				y: y - size / 2,
				size,
			};

			setRipples((prev) => {
				const updated = [...prev, newRipple];

				// Enforce max ripples limit
				if (maxRipples > 0 && updated.length > maxRipples) {
					// Remove oldest ripples
					const removed = updated.slice(0, updated.length - maxRipples);
					removed.forEach((ripple) => {
						const timeout = timeoutRefs.current.get(ripple.key);
						if (timeout) {
							clearTimeout(timeout);
							timeoutRefs.current.delete(ripple.key);
						}
					});
					return updated.slice(-maxRipples);
				}

				return updated;
			});

			// Auto-remove ripple after duration
			if (duration > 0) {
				const timeout = setTimeout(() => clearRipple(key), duration);
				timeoutRefs.current.set(key, timeout);
			}
		},
		[disabled, duration, maxRipples, clearRipple, enableHapticFeedback]
	);

	// Cleanup all timeouts on unmount
	useEffect(() => {
		return () => {
			timeoutRefs.current.forEach((timeout) => clearTimeout(timeout));
			timeoutRefs.current.clear();
		};
	}, []);

	return { ripples, createRipple, clearRipple, clearAllRipples };
}
