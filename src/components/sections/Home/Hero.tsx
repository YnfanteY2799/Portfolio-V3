import BlurOnScroll from "@/components/ui/HOC/BlurOnScroll";
import { type ReactNode } from "react";

export default function HomeHeroSection(): ReactNode {
	return (
		<BlurOnScroll
			id="About_Me"
			className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
			Hero Section
		</BlurOnScroll>
	);
}
