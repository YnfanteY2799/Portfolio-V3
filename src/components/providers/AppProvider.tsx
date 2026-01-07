"use client";
import { ThemeProvider } from "next-themes";

import type { ReactNode } from "react";
import type { IRSC } from "@/types";

export default function AppProvider({ children }: IRSC): ReactNode {
	return (
		<ThemeProvider attribute="class" defaultTheme="dark">
			{children}
		</ThemeProvider>
	);
}
