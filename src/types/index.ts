import { ReactNode } from "react";

export interface IRSC {
	children: ReactNode;
}

export interface ITRSC extends IRSC {
	params: Promise<{ locale: string }>;
}
