"use client";
import { type RefCallback, useRef, useCallback, useEffect, useMemo } from "react";

import type { IntersectionObserverOptions, IntersectionResult, SharedIntersectionObserverResult } from "@/types/hooks";

/**
 * Creates and manages a singleton IntersectionObserver instance shared across components.
 *
 * @template T - The type of Element to observe (defaults to Element)
 * @param options - Optional IntersectionObserver configuration options
 * @returns An object with methods to register and unregister elements with the shared observer
 *
 * @example
 * ```tsx
 * // Basic usage with HTMLDivElement type
 * function BasicComponent() {
 *   const ref = useRef<HTMLDivElement>(null);
 *   const [isVisible, setIsVisible] = useState(false);
 *   const { observe, unobserve } = useSharedIntersectionObserver<HTMLDivElement>();
 *
 *   useEffect(() => {
 *     if (!ref.current) return;
 *
 *     observe(ref.current, (result) => {
 *       // Type-safe access to div properties
 *       console.log(result.target.clientHeight);
 *       setIsVisible(result.isIntersecting);
 *     });
 *
 *     return () => {
 *       if (ref.current) unobserve(ref.current);
 *     };
 *   }, [observe, unobserve]);
 *
 *   return <div ref={ref}>I appear and disappear!</div>;
 * }
 * ```
 */
export default function useSharedIntersectionObserver<T extends Element = Element>(
	options?: IntersectionObserverOptions
): SharedIntersectionObserverResult<T> {
	// Create a stable reference to options
	const optionsRef = useRef(options);

	// Update options ref if they change
	useEffect(() => {
		optionsRef.current = options;
	}, [options]);

	// Default options with reasonable values for most use cases
	const defaultOptions = useMemo(
		() => ({
			threshold: [0, 1], // Just track entering and fully visible states by default
			rootMargin: "0px",
			root: null,
			debounceMs: 0,
		}),
		[]
	);

	// Define the type for our debounce timeout handlers
	type TimeoutMap = Map<Element, ReturnType<typeof setTimeout>>;

	// Type for our callback function storage
	type CallbackStorage = Map<
		Element,
		{
			// Store the callback with its specific element type
			// This uses a type erasure pattern to maintain type safety
			callback: <E extends Element>(result: IntersectionResult<E>) => void;
			// Store the element type for runtime type checking
			elementType: string;
		}
	>;

	// Store for shared observer instance, element callbacks, and timeouts
	const observerStore = useRef<{
		observer: IntersectionObserver | null;
		elements: CallbackStorage;
		options: IntersectionObserverOptions;
		timeouts: TimeoutMap;
		isDisconnecting: boolean;
	}>({
		observer: null,
		elements: new Map(),
		options: { ...defaultOptions, ...options },
		timeouts: new Map(),
		isDisconnecting: false,
	});

	// Clear any pending timeouts for an element
	const clearElementTimeout = useCallback((element: Element) => {
		const timeout = observerStore.current.timeouts.get(element);
		if (timeout) {
			clearTimeout(timeout);
			observerStore.current.timeouts.delete(element);
		}
	}, []);

	// Handle an intersection entry with optional debouncing
	const handleIntersection = useCallback(
		(entry: IntersectionObserverEntry) => {
			const { elements, options, timeouts } = observerStore.current;
			const callbackData = elements.get(entry.target);

			if (!callbackData) return;

			const mergedOptions = { ...defaultOptions, ...options };
			const debounceMs = mergedOptions.debounceMs ?? 0;

			// Type-safe callback execution through type erasure pattern
			const executeCallback = () => {
				if (callbackData) {
					// Create the result object with the entry target cast to the correct type
					// This is safe because we store the element with its exact type
					const result: IntersectionResult<Element> = {
						isIntersecting: entry.isIntersecting,
						intersectionRatio: entry.intersectionRatio,
						entry,
						target: entry.target,
					};

					// Execute the callback with the properly typed result
					// TypeScript will erase the generic parameter at runtime
					callbackData.callback(result);
				}

				timeouts.delete(entry.target);
			};

			// Clear any existing timeout for this element
			clearElementTimeout(entry.target);

			if (debounceMs <= 0) {
				// Execute immediately if no debounce
				executeCallback();
			} else {
				// Set debounced execution
				const timeout = setTimeout(executeCallback, debounceMs);
				timeouts.set(entry.target, timeout);
			}
		},
		[clearElementTimeout, defaultOptions]
	);

	// Initialize observer lazily on client-side only
	const getObserver = useCallback(() => {
		// Skip on server-side rendering
		if (typeof window === "undefined") return null;

		// Don't create new observer if we're in the process of disconnecting
		if (observerStore.current.isDisconnecting) return null;

		// Create observer if it doesn't exist
		if (!observerStore.current.observer) {
			const mergedOptions = {
				...defaultOptions,
				...optionsRef.current,
			};

			// Filter out non-IntersectionObserver options
			const { debounceMs, ...intersectionOptions } = mergedOptions;

			observerStore.current.observer = new IntersectionObserver((entries) => {
				entries.forEach(handleIntersection);
			}, intersectionOptions);
		}

		return observerStore.current.observer;
	}, [defaultOptions, handleIntersection]);

	// Observe an element with a callback
	const observe = useCallback(
		<E extends T>(element: E, callback: (result: IntersectionResult<E>) => void): E => {
			const observer = getObserver();
			if (!observer) return element;

			// Remove any existing observation first
			unobserve(element);

			// Store callback and element type information
			observerStore.current.elements.set(element, {
				// Use type erasure to store the callback with its specific type
				callback: callback as <U extends Element>(result: IntersectionResult<U>) => void,
				// Store the constructor name for runtime type checking
				elementType: element.constructor.name,
			});

			observer.observe(element);
			return element;
		},
		[getObserver]
	);

	// Stop observing an element
	const unobserve = useCallback(
		<E extends T>(element: E): E => {
			const { observer, elements } = observerStore.current;

			// Clear any pending timeouts
			clearElementTimeout(element);

			if (observer && elements.has(element)) {
				// Clean up references and stop observing
				elements.delete(element);
				observer.unobserve(element);

				// Disconnect observer if no elements are being tracked
				if (elements.size === 0) {
					observer.disconnect();
					observerStore.current.observer = null;
				}
			}

			return element;
		},
		[clearElementTimeout]
	);

	// Clean up all resources
	const disconnect = useCallback(() => {
		const { observer, elements, timeouts } = observerStore.current;

		// Mark as disconnecting to prevent new observers from being created
		observerStore.current.isDisconnecting = true;

		// Clear all timeouts
		timeouts.forEach((timeout) => clearTimeout(timeout));
		timeouts.clear();

		// Disconnect observer
		if (observer) {
			observer.disconnect();
			observerStore.current.observer = null;
		}

		// Clear element references
		elements.clear();

		// Reset disconnecting flag
		setTimeout(() => {
			observerStore.current.isDisconnecting = false;
		}, 0);
	}, []);

	// Create utility method to observe with a ref
	const observeRef = useCallback(
		<E extends T>(callback: (result: IntersectionResult<E>) => void): RefCallback<E> => {
			return (element: E | null) => {
				if (element) {
					observe(element, callback);
				}
			};
		},
		[observe]
	);

	// Handle component unmount
	useEffect(() => {
		return () => {
			// Only contribute to cleanup if there are no elements being observed
			if (observerStore.current.elements.size === 0) {
				disconnect();
			}
		};
	}, [disconnect]);

	// Return typed interface
	return {
		observe,
		unobserve,
		disconnect,
		observeRef,
		isObserving: useCallback((element: T) => observerStore.current.elements.has(element), []),
	};
}
