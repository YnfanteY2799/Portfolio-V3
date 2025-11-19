import { useCallback, useEffect, useState, useRef } from "react";

/** Options for the useScroll hook */
interface UseScrollOptions {
	/** Throttle time in milliseconds to improve performance */
	throttleMs?: number;
	/** Initial scrollY position */
	initialScrollY?: number;
	/** Whether to use passive event listeners for better performance */
	passive?: boolean;
	/** Threshold to consider that scrolling has started (in pixels) */
	scrollThreshold?: number;
	/** Whether to track scroll direction changes */
	listenToDirectionChanges?: boolean;
	/** Whether to track when scrolling ends */
	trackScrollEnd?: boolean;
	/** Delay to consider scrolling has ended (in milliseconds) */
	scrollEndDelay?: number;
	/** Whether to use requestAnimationFrame for smoother updates */
	useRaf?: boolean;
	/** Optional callback function to run when scrolling ends */
	onScrollEnd?: (scrollState: ScrollState) => void;
}

/** Scroll direction type */
type ScrollDirection = "up" | "down" | null;

/** Horizontal scroll direction type */
type HorizontalDirection = "left" | "right" | null;

/** Scroll to options interface */
interface ScrollToOptions {
	/** Vertical position to scroll to */
	top?: number;
	/** Horizontal position to scroll to */
	left?: number;
	/** Scroll behavior (smooth or auto) */
	behavior?: ScrollBehavior;
}

/** Scroll state returned by useScroll hook */
interface ScrollState {
	/** Current vertical scroll position */
	scrollY: number;
	/** Current horizontal scroll position */
	scrollX: number;
	/** Whether the page is currently scrolling */
	isScrolling: boolean;
	/** Whether scroll has started (beyond threshold) */
	scrollStarted: boolean;
	/** Current vertical scroll direction */
	direction: ScrollDirection;
	/** Current horizontal scroll direction */
	horizontalDirection: HorizontalDirection;
	/** Whether scrolling has ended after movement */
	scrollEnded: boolean;
	/** Scroll progress as a percentage of page height (0-100) */
	scrollProgress: number;
	/** Function to programmatically scroll to a position */
	scrollTo: (options?: ScrollToOptions) => void;
}

/**
 * useScroll - A high-performance React hook for detecting and responding to scroll events
 *
 * This hook provides a reactive way to track page scrolling with minimal performance impact.
 * It uses throttling and requestAnimationFrame to ensure smooth performance even on
 * scroll-heavy pages. The hook is fully compatible with React 19's concurrent rendering
 * and Next.js 15's server components architecture.
 *
 * @example
 * // Basic usage
 * const { isScrolling, scrollStarted } = useScroll();
 *
 * // With custom options
 * const { scrollY, direction, scrollProgress, scrollTo } = useScroll({
 *   throttleMs: 20,
 *   scrollThreshold: 50,
 *   listenToDirectionChanges: true,
 *   onScrollEnd: () => console.log('Scrolling ended')
 * });
 *
 * @param options - Configuration options for the scroll hook
 * @returns Scroll state object
 */
export default function useScroll({
	listenToDirectionChanges = false,
	trackScrollEnd = false,
	scrollEndDelay = 200,
	scrollThreshold = 0,
	initialScrollY = 0,
	throttleMs = 10,
	passive = true,
	useRaf = true,
	onScrollEnd = () => {},
}: UseScrollOptions = {}): ScrollState {
	// Check if we're in a browser environment
	const isBrowser = typeof window !== "undefined";

	// State to track scroll position and status
	const [scrollY, setScrollY] = useState<number>(isBrowser ? window.scrollY : initialScrollY);
	const [horizontalDirection, setHorizontalDirection] = useState<HorizontalDirection>(null);
	const [scrollX, setScrollX] = useState<number>(isBrowser ? window.scrollX : 0);
	const [scrollStarted, setScrollStarted] = useState<boolean>(false);
	const [direction, setDirection] = useState<ScrollDirection>(null);
	const [scrollProgress, setScrollProgress] = useState<number>(0);
	const [isScrolling, setIsScrolling] = useState<boolean>(false);
	const [scrollEnded, setScrollEnded] = useState<boolean>(false);

	// Refs for tracking scroll position and throttling
	const previousScrollY = useRef<number>(isBrowser ? window.scrollY : initialScrollY);
	const currentHorizontalDirectionRef = useRef<HorizontalDirection>(null);
	const previousScrollX = useRef<number>(isBrowser ? window.scrollX : 0);
	const scrollEndTimeout = useRef<number | null>(null);
	const throttleTimeout = useRef<number | null>(null);
	const currentDirectionRef = useRef<ScrollDirection>(null);
	const isScrollingRef = useRef<boolean>(false);
	const maxScrollHeightRef = useRef<number>(0);
	const rafId = useRef<number | null>(null);

	// Create a mutable ref to store the current state to avoid closure issues in callbacks
	const stateRef = useRef<Omit<ScrollState, "scrollTo">>({
		horizontalDirection,
		scrollProgress,
		scrollStarted,
		isScrolling,
		scrollEnded,
		direction,
		scrollY,
		scrollX,
	});

	// Update the ref when state changes
	useEffect(() => {
		stateRef.current = {
			horizontalDirection,
			scrollProgress,
			scrollStarted,
			scrollEnded,
			isScrolling,
			direction,
			scrollY,
			scrollX,
		};
	}, [scrollY, scrollX, isScrolling, scrollStarted, direction, horizontalDirection, scrollEnded, scrollProgress]);

	// Calculate max scroll height (accounting for viewport height)
	const getMaxScrollHeight = useCallback((): number => {
		if (!isBrowser) return 0;

		return (
			Math.max(
				document.documentElement.scrollHeight,
				document.documentElement.offsetHeight,
				document.documentElement.clientHeight,
				document.body.scrollHeight,
				document.body.offsetHeight,
				document.body.clientHeight
			) - window.innerHeight
		);
	}, [isBrowser]);

	// Update maxScrollHeight on resize
	useEffect(() => {
		if (!isBrowser) return undefined;

		const updateMaxScrollHeight = (): void => {
			maxScrollHeightRef.current = getMaxScrollHeight();
		};

		updateMaxScrollHeight();
		window.addEventListener("resize", updateMaxScrollHeight, { passive: true });

		return () => {
			window.removeEventListener("resize", updateMaxScrollHeight);
		};
	}, [getMaxScrollHeight, isBrowser]);

	// Handle scroll end
	const handleScrollEnd = useCallback(() => {
		setIsScrolling(() => false);
		setScrollEnded(() => true);
		isScrollingRef.current = false;

		if (typeof onScrollEnd === "function") {
			// scrollTo will be properly defined later
			onScrollEnd({ ...stateRef.current, scrollTo: () => {} });
		}
	}, [onScrollEnd]);

	// Handle scroll event with throttling
	const handleScroll = useCallback(() => {
		if (!isBrowser || throttleTimeout.current !== null) return;

		const updateScrollState = (): void => {
			const currentScrollY = window.scrollY;
			const currentScrollX = window.scrollX;
			const maxScrollHeight = maxScrollHeightRef.current || getMaxScrollHeight();
			maxScrollHeightRef.current = maxScrollHeight;

			// Update scroll position
			setScrollY(() => currentScrollY);
			setScrollX(() => currentScrollX);

			// Calculate scroll progress as percentage
			setScrollProgress(() => (maxScrollHeight > 0 ? Math.min(Math.max((currentScrollY / maxScrollHeight) * 100, 0), 100) : 0));

			// Determine if scrolling has started (beyond threshold)
			if (currentScrollY > scrollThreshold && !stateRef.current.scrollStarted) setScrollStarted(() => true);
			else if (currentScrollY <= scrollThreshold && stateRef.current.scrollStarted) setScrollStarted(() => false);

			// Determine if actively scrolling
			if (!isScrollingRef.current) {
				setIsScrolling(true);
				isScrollingRef.current = true;
			}

			// Track scroll direction if enabled
			if (listenToDirectionChanges) {
				const newVerticalDirection: ScrollDirection =
					currentScrollY > previousScrollY.current ? "down" : currentScrollY < previousScrollY.current ? "up" : currentDirectionRef.current;

				const newHorizontalDirection: HorizontalDirection =
					currentScrollX > previousScrollX.current
						? "right"
						: currentScrollX < previousScrollX.current
						? "left"
						: currentHorizontalDirectionRef.current;

				// Only update state if direction has changed
				if (newVerticalDirection !== currentDirectionRef.current) {
					setDirection(newVerticalDirection);
					currentDirectionRef.current = newVerticalDirection;
				}

				if (newHorizontalDirection !== currentHorizontalDirectionRef.current) {
					setHorizontalDirection(newHorizontalDirection);
					currentHorizontalDirectionRef.current = newHorizontalDirection;
				}
			}

			// Reset scroll end state when scrolling
			if (trackScrollEnd) {
				setScrollEnded(false);
				if (scrollEndTimeout.current !== null) {
					window.clearTimeout(scrollEndTimeout.current);
					scrollEndTimeout.current = null;
				}

				// Set timeout to determine when scrolling has ended
				scrollEndTimeout.current = window.setTimeout(handleScrollEnd, scrollEndDelay);
			}

			// Update previous scroll position
			previousScrollY.current = currentScrollY;
			previousScrollX.current = currentScrollX;

			// Set throttle timeout
			throttleTimeout.current = window.setTimeout(() => {
				throttleTimeout.current = null;
			}, throttleMs);
		};

		// Use requestAnimationFrame for smoother updates if enabled
		if (useRaf) rafId.current = window.requestAnimationFrame(updateScrollState);
		else updateScrollState();
	}, [
		listenToDirectionChanges,
		getMaxScrollHeight,
		handleScrollEnd,
		scrollThreshold,
		trackScrollEnd,
		scrollEndDelay,
		throttleMs,
		isBrowser,
		useRaf,
	]);

	// Scroll to a specific position programmatically
	const scrollTo = useCallback(
		({ top, behavior, left }: ScrollToOptions = { behavior: "smooth" }): void => {
			if (!isBrowser) return;
			window.scrollTo({ top, left, behavior });
		},
		[isBrowser]
	);

	// Set up and clean up event listeners
	useEffect(() => {
		if (!isBrowser) return undefined;

		// Initialize scroll position on mount
		const initialScrollPosition = window.scrollY;
		const initialHorizontalPosition = window.scrollX;
		setScrollY(initialScrollPosition);
		setScrollX(initialHorizontalPosition);
		previousScrollY.current = initialScrollPosition;
		previousScrollX.current = initialHorizontalPosition;
		maxScrollHeightRef.current = getMaxScrollHeight();

		// Add event listener with passive option for better performance
		window.addEventListener("scroll", handleScroll, { passive });

		// Clean up event listeners and timeouts on unmount
		return () => {
			window.removeEventListener("scroll", handleScroll);

			if (throttleTimeout.current !== null) {
				window.clearTimeout(throttleTimeout.current);
				throttleTimeout.current = null;
			}

			if (scrollEndTimeout.current !== null) {
				window.clearTimeout(scrollEndTimeout.current);
				scrollEndTimeout.current = null;
			}

			if (rafId.current !== null) {
				window.cancelAnimationFrame(rafId.current);
				rafId.current = null;
			}
		};
	}, [getMaxScrollHeight, handleScroll, isBrowser, passive]);

	return {
		horizontalDirection,
		scrollProgress,
		scrollStarted,
		isScrolling,
		scrollEnded,
		direction,
		scrollTo,
		scrollY,
		scrollX,
	};
}
