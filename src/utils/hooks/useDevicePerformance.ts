"use client";
import { useMemo } from "react";

import type { DevicePerformanceLevel, DevicePerformanceOptions } from "@/types/hooks";

/**
 * Hook that determines the device's performance capabilities.
 * Used to automatically adjust animation complexity based on the device.
 *
 * @param options - Configuration options for performance detection
 * @returns Performance level as "high", "medium", or "low"
 */
export default function useDevicePerformance(options?: DevicePerformanceOptions): DevicePerformanceLevel {
	const { lowEndCoreThreshold = 4, midRangeCoreThreshold = 6, domProcessingThreshold = 800, memoryThreshold = 4 } = options || {};
	return useMemo(() => {
		// Server-side rendering check
		if (typeof window === "undefined") return "high";

		try {
			// Performance indicators collection
			const indicators: Record<string, boolean> = {
				isSlowDomProcessing: false,
				isMobileDevice: false,
				isLowMemory: false,
				isLowCores: false,
				isMidCores: false,
			};

			// CPU cores check
			const cores = navigator.hardwareConcurrency || 0;
			indicators.isLowCores = cores > 0 && cores <= lowEndCoreThreshold;
			indicators.isMidCores = cores > lowEndCoreThreshold && cores <= midRangeCoreThreshold;

			// Mobile device detection using regex pattern
			const mobilePattern = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
			indicators.isMobileDevice = mobilePattern.test(navigator.userAgent);

			// Memory check (if available)
			if ("deviceMemory" in navigator) indicators.isLowMemory = (navigator as any).deviceMemory < memoryThreshold;

			// Navigation timing check
			if (typeof performance !== "undefined") {
				const navEntries = performance.getEntriesByType("navigation");
				if (navEntries.length > 0) {
					const navTiming = navEntries[0] as PerformanceNavigationTiming;
					indicators.isSlowDomProcessing = navTiming.domComplete - navTiming.domInteractive > domProcessingThreshold;
				}
			}

			// Determine performance level based on indicators
			const lowEndIndicators = Object.values(indicators).filter(Boolean).length;
			if (lowEndIndicators >= 3 || (indicators.isLowCores && indicators.isLowMemory)) return "low";
			else if (lowEndIndicators >= 1) return "medium";
			return "high";
		} catch (error) {
			// Fallback to high performance if detection fails
			console.warn("Error detecting device performance:", error);
			return "high";
		}
	}, [lowEndCoreThreshold, midRangeCoreThreshold, domProcessingThreshold, memoryThreshold]);
}
