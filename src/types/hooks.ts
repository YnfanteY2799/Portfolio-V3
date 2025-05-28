import type { RefCallback, RefObject } from "react";

/**
 * Options for the Intersection Observer API
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
 */
export interface UseIntersectionObserverOptions extends IntersectionObserverInit {
	/**
	 * Whether to freeze the observer when the element is no longer in view
	 * This can improve performance by not firing callbacks when not needed
	 * @default true
	 */
	freezeOnceVisible?: boolean;

	/**
	 * Whether to disconnect the observer immediately after the first intersection
	 * This can improve performance for one-time observations
	 * @default false
	 */
	disconnectOnceVisible?: boolean;

	/**
	 * Whether the hook should skip setting up the observer
	 * Useful for conditional observation
	 * @default false
	 */
	skip?: boolean;
}

/**
 * Result object returned by the useIntersectionObserver hook
 *
 * @template T - The type of the observed element (defaults to Element)
 *
 * @property {IntersectionObserverEntry | null} entry - The most recent intersection entry
 * containing information about the intersection between the target and its root container.
 * Will be null if no intersection has occurred yet.
 *
 * @property {IntersectionObserver | null} observer - The IntersectionObserver instance used
 * for observing the element. Will be null if the observer hasn't been created yet,
 * the browser doesn't support IntersectionObserver, or the observer was disconnected.
 *
 * @property {RefObject<T | null>} ref - React ref object to attach to the target DOM element
 * that should be observed. The element type is specified by the generic parameter T.
 *
 * @property {boolean} isIntersecting - Convenience boolean indicating whether the target element
 * is currently intersecting with the root container according to the threshold settings.
 * True when the element is visible in the viewport (or root), false otherwise.
 */
export interface IIntersectionObserverResult<T extends Element = Element> {
	entry: IntersectionObserverEntry | null;
	observer: IntersectionObserver | null;
	ref: RefObject<T | null>;
	isIntersecting: boolean;
}

/**
 * Configuration options for the IntersectionObserver
 */
export interface IntersectionObserverOptions extends IntersectionObserverInit {
	/**
	 * Delay in milliseconds before handling intersection changes
	 * Useful for debouncing rapid scroll events
	 */
	debounceMs?: number;
}

/**
 * Result of an intersection observation with the target element type
 */
export interface IntersectionResult<T extends Element> {
	/** Whether the element is currently intersecting the viewport */
	isIntersecting: boolean;
	/** Ratio of the element's visible area (0-1) */
	intersectionRatio: number;
	/** The raw IntersectionObserverEntry object */
	entry: IntersectionObserverEntry;
	/** The target element being observed (typed) */
	target: T;
}

/**
 * Type for the element-to-callback mapping
 * Uses a conditional type to ensure callback type matches the element type
 */
export type ElementCallbackMap = Map<Element, <E extends Element>(result: IntersectionResult<E>) => void>;

/**
 * Interface for the return value of the useSharedIntersectionObserver hook
 */
export interface SharedIntersectionObserverResult<T extends Element> {
	/**
	 * Observe an element with a callback
	 * @param element The element to observe
	 * @param callback Function called when intersection state changes
	 * @returns The same element for chaining
	 */
	observe: <E extends T>(element: E, callback: (result: IntersectionResult<E>) => void) => E;

	/**
	 * Stop observing an element
	 * @param element The element to stop observing
	 * @returns The same element for chaining
	 */
	unobserve: <E extends T>(element: E) => E;

	/**
	 * Create a ref callback to observe an element
	 * @param callback Function called when intersection state changes
	 * @returns A ref callback for React elements
	 */
	observeRef: <E extends T>(callback: (result: IntersectionResult<E>) => void) => RefCallback<E>;

	/**
	 * Check if an element is being observed
	 * @param element The element to check
	 * @returns Whether the element is currently being observed
	 */
	isObserving: (element: T) => boolean;

	/**
	 * Disconnect the observer and clean up all resources
	 */
	disconnect: () => void;
}
