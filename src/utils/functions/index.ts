import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs));
}

export function hexToVec4(hex: string): [number, number, number, number] {
	let hexStr = hex.replace("#", "");
	let r = 0,
		g = 0,
		b = 0,
		a = 1;
	if (hexStr.length === 6) {
		r = parseInt(hexStr.slice(0, 2), 16) / 255;
		g = parseInt(hexStr.slice(2, 4), 16) / 255;
		b = parseInt(hexStr.slice(4, 6), 16) / 255;
	} else if (hexStr.length === 8) {
		r = parseInt(hexStr.slice(0, 2), 16) / 255;
		g = parseInt(hexStr.slice(2, 4), 16) / 255;
		b = parseInt(hexStr.slice(4, 6), 16) / 255;
		a = parseInt(hexStr.slice(6, 8), 16) / 255;
	}
	return [r, g, b, a];
}
