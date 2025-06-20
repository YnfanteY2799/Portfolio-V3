import type { IGenericIconSvg } from "@/types/components";
import type { ReactElement } from "react";

export default function DevToIcon({ size = 24, className }: IGenericIconSvg): ReactElement {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 32 32" className={className}>
      <path
        fill="currentColor"
        d="M2 7v18h28V7H2zm2 2h24v14H4V9zm2 2v10h3c1.654 0 3-1.346 3-3v-4c0-1.654-1.346-3-3-3H6zm10 0c-1.103 0-2 .897-2 2v6c0 1.103.897 2 2 2h2v-2h-2v-2h2v-2h-2v-2h2v-2h-2zm3.691 0l2.084 9.025a1.258 1.258 0 0 0 2.45 0L26.309 11h-2.053L23 16.44L21.744 11h-2.053zM8 13h1a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H8v-6z"
      />
    </svg>
  );
}
