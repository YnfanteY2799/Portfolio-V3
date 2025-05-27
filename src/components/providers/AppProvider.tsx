import type { ReactNode } from "react";
import type { IRSC } from "@/types";

export default function AppProvider({ children }: IRSC): ReactNode {
	return <>{children}</>;
}
