import { useEffect, useState } from "react";

/**
 * Custom hook that returns whether the component has been mounted
 * Optimized for Next.js applications to prevent hydration mismatches
 * @returns {boolean} Whether the component has mounted
 */
export default function useHasBeenMounted(): boolean {
	// Use undefined as initial state to avoid hydration mismatch
	const [hasMounted, setHasMounted] = useState<boolean | undefined>(undefined);

	// Only run this effect once on client-side
	useEffect(() => setHasMounted(() => true), []);

	// Return false during SSR, true after mounting
	return hasMounted === true;
}
