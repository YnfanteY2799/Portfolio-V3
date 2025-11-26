import { type RefObject, type Ref, useCallback } from "react";

export default function useMergeRefs<T>(...refs: Array<Ref<T> | undefined>) {
	return useCallback((node: T | null) => {
		refs.forEach((ref) => {
			if (!ref) return;
			if (typeof ref === "function") ref(node);
			else (ref as RefObject<T | null>).current = node;
		});
	}, refs);
}
