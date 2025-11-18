import { ReactNode } from "react";

export interface IRSC {
	children: ReactNode;
}

export interface ICRSC extends IRSC {
	className?: string;
}

export interface ITRSC extends IRSC {
	params: Promise<{ locale: string }>;
}
