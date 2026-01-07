import type { RefCallback, RefObject, MouseEvent, TouchEvent } from "react";

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

/**
 * Device performance capability levels
 */
export type DevicePerformanceLevel = "high" | "medium" | "low";

/**
 * Configuration options for device performance detection
 */
export interface DevicePerformanceOptions {
	/** Threshold for low-end CPU cores (default: 4) */
	lowEndCoreThreshold?: number;
	/** Threshold for mid-range CPU cores (default: 6) */
	midRangeCoreThreshold?: number;
	/** DOM processing time threshold in ms (default: 800) */
	domProcessingThreshold?: number;
	/** Memory threshold in GB for low-end devices (default: 4) */
	memoryThreshold?: number;
}

/**
 * Represents a single ripple effect instance.
 */
export interface RippleType {
	/**
	 * Unique identifier for the ripple.
	 */
	key: number;

	/**
	 * X position of ripple center relative to element (in pixels).
	 */
	x: number;

	/**
	 * Y position of ripple center relative to element (in pixels).
	 */
	y: number;

	/**
	 * Diameter of the ripple circle (in pixels).
	 */
	size: number;
}

/**
 * Configuration options for the useRipple hook.
 */
export interface UseRippleOptions {
	/**
	 * Whether ripple effect is disabled.
	 * @default false
	 */
	disabled?: boolean;

	/**
	 * Duration in milliseconds for ripple animation.
	 * After this duration, ripples are automatically removed.
	 * Set to 0 to disable auto-removal (manual cleanup required).
	 * @default 600
	 */
	duration?: number;

	/**
	 * Maximum number of simultaneous ripples allowed.
	 * Older ripples are removed when limit is exceeded.
	 * Set to 0 for unlimited ripples.
	 * @default 3
	 */
	maxRipples?: number;

	/**
	 * Whether ripple effect should emit haptic response.
	 * @default false
	 */
	enableHapticFeedback?: boolean;
}

/**
 * Return type for the useRipple hook.
 */
export interface UseRippleReturn {
	/**
	 * Array of active ripple instances.
	 * Map over this to render ripple elements in your component.
	 *
	 * @example
	 * {ripples.map(ripple => (
	 *   <span
	 *     key={ripple.key}
	 *     style={{
	 *       left: ripple.x,
	 *       top: ripple.y,
	 *       width: ripple.size,
	 *       height: ripple.size
	 *     }}
	 *   />
	 * ))}
	 */
	ripples: RippleType[];

	/**
	 * Creates a new ripple at the event's click/touch position.
	 * Call this in onMouseDown or onTouchStart handlers.
	 *
	 * @param event - Mouse or touch event from the target element
	 *
	 * @example
	 * <button onMouseDown={createRipple}>Click me</button>
	 */
	createRipple: (event: MouseEvent<HTMLElement> | TouchEvent<HTMLElement>) => void;

	/**
	 * Removes a specific ripple by its key.
	 * Useful for manual cleanup when animations complete.
	 *
	 * @param key - Unique key of the ripple to remove
	 */
	clearRipple: (key: number) => void;

	/**
	 * Immediately removes all active ripples.
	 * Useful for cleanup on component state changes.
	 */
	clearAllRipples: () => void;
}

/**
 * Interface representing the return value of the useToggle hook.
 */
export interface ReturnUseToggleHook {
	/**
	 * The current boolean state value.
	 */
	value: boolean;

	/**
	 * Toggles the boolean value to its opposite state.
	 * If the current value is true, it becomes false.
	 * If the current value is false, it becomes true.
	 *
	 * This function is memoized with useCallback to maintain referential equality
	 * across renders, which is important for optimization when passed to child components
	 * or used in dependency arrays of useEffect hooks.
	 */
	toggle: () => void;

	/**
	 * Sets the boolean value to true.
	 *
	 * This is useful when you need to explicitly set the state to true
	 * regardless of its current value, such as when opening a modal
	 * or activating a feature in response to an event.
	 *
	 * The function is memoized with useCallback for performance optimization.
	 */
	setTrue: () => void;

	/**
	 * Sets the boolean value to false.
	 *
	 * This is useful when you need to explicitly set the state to false
	 * regardless of its current value, such as when closing a modal
	 * or deactivating a feature in response to an event.
	 *
	 * The function is memoized with useCallback for performance optimization.
	 */
	setFalse: () => void;
}
