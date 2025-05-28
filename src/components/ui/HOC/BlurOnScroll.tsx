import useSharedIntersectionObserver from "@/utils/hooks/useSharedIntersectionObserver.ts";
import { m, useReducedMotion, LazyMotion, domAnimation } from "motion/react";
import useDevicePerformance from "@/utils/hooks/useDevicePerformance.ts";
import useHasBeenMounted from "@/utils/hooks/useHasBeenMounted.ts";
import { type ReactNode } from "react";

import type { IBlurOnScrollProps, CallBackEntryType } from "@/types/components.ts";

export default function BlurOnScroll(): ReactNode {}
