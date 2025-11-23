import { useState, useCallback, type MouseEvent } from "react";

import type { RippleType, UseRippleReturn } from "@/types/hooks";

/**
 * A custom React hook for creating ripple effects on UI elements.
 *
 * This hook manages ripple animations that appear when users interact with elements,
 * commonly used for Material Design-style feedback effects. It automatically creates
 * and removes ripples based on mouse events and prevents excessive ripples by limiting
 * the maximum number of concurrent animations.
 *
 * @param {number} [d=600] - The duration in milliseconds for each ripple animation.
 *                           After this time, the ripple will be automatically removed.
 *                           Defaults to 600ms.
 *
 * @returns {UseRippleReturn} An object containing:
 *   - ripples: Array of active ripple objects with position and id data
 *   - createRipple: Function to trigger a new ripple at the click position
 *   - clearRipples: Function to immediately remove all active ripples
 *
 * @example
 * ```tsx
 * function Button() {
 *   const { ripples, createRipple } = useRipple(800);
 *
 *   return (
 *     <button onClick={createRipple} style={{ position: 'relative', overflow: 'hidden' }}>
 *       Click me
 *       {ripples.map(ripple => (
 *         <span
 *           key={ripple.id}
 *           style={{ left: ripple.x, top: ripple.y }}
 *           className="ripple-animation"
 *         />
 *       ))}
 *     </button>
 *   );
 * }
 * ```
 */
export function useRipple(d: number = 600): UseRippleReturn {
	/**
	 * Array of currently active ripple effects.
	 * Each ripple contains a unique id and x/y coordinates.
	 */
	const [ripples, setRipples] = useState<Array<RippleType>>([]);

	/**
	 * Creates a new ripple effect at the mouse click position.
	 *
	 * This function calculates the click position relative to the target element's
	 * bounding box and creates a new ripple object. The ripple is automatically
	 * removed after the specified duration. The function prevents creating more
	 * than 5 concurrent ripples for performance reasons.
	 *
	 * @param {MouseEvent<Element>} event - The mouse event from the click interaction
	 * @param {Element} event.currentTarget - The element that the event listener is attached to
	 * @param {number} event.clientX - The horizontal coordinate of the mouse pointer
	 * @param {number} event.clientY - The vertical coordinate of the mouse pointer
	 *
	 * @returns {void}
	 */
	const createRipple = useCallback(
		({ currentTarget, clientX, clientY }: MouseEvent<Element>): void => {
			// Limit concurrent ripples to prevent performance issues
			if (ripples.length >= 5) return;

			// Calculate click position relative to the element
			const rect = currentTarget.getBoundingClientRect();
			const x = clientX - rect.left;
			const y = clientY - rect.top;

			// Create ripple with unique ID and position
			const newRipple: RippleType = { id: Date.now() + Math.random(), x, y };
			setRipples((prev) => [...prev, newRipple]);

			// Auto-remove ripple after duration expires
			setTimeout(() => setRipples((prev) => prev.filter(({ id }) => id !== newRipple.id)), d);
		},
		[d, ripples.length]
	);

	/**
	 * Clears all active ripples immediately.
	 *
	 * This function removes all ripples from the state, which can be useful
	 * for cleanup or when you want to reset the ripple effects.
	 *
	 * @returns {void}
	 */
	const clearRipples = useCallback(() => setRipples([]), []);

	return { ripples, createRipple, clearRipples };
}
