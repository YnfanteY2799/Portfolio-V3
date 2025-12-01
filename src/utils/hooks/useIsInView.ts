import { useInView, type UseInViewOptions } from "motion/react";
import { type Ref, useImperativeHandle, useRef } from "react";

export interface UseIsInViewOptions {
	inView?: boolean;
	inViewOnce?: boolean;
	inViewMargin?: UseInViewOptions["margin"];
}

export default function useIsInView<T extends HTMLElement = HTMLElement>(ref: Ref<T>, options: UseIsInViewOptions) {
	const { inView, inViewOnce = false, inViewMargin = "0px" } = options ?? {};
	const localRef = useRef<T>(null);
	useImperativeHandle(ref, () => localRef.current as T);
	const isInView = !inView || useInView(localRef, { once: inViewOnce, margin: inViewMargin });
	return { ref: localRef, isInView };
}
