"use client";
import Balatro from "@/components/ui/backgrounds/balatro";
import { type ReactNode } from "react";

export default function ContactMeSection(): ReactNode {
	return (
		<section id="Contact_Me" className="relative isolate overflow-hidden bg-background min-h-screen">
			{/* Background */}

			<div className="absolute inset-0 -z-10">
				<Balatro color1="#de443b" color2="#162325" color3="#006BB4" pixelFilter={2000} />
			</div>

			<div className={"absolute inset-0 -z-5 bg-background/1 backdrop-blur-sm"} />

			{/* Content */}
			<div className="relative z-10 p-8">XDDD</div>
		</section>
	);
}
