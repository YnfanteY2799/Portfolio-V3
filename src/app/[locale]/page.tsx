import { HomeHeroSection, HomeAboutSection } from "@/components/sections";
import type { ReactNode } from "react";

export default function Home(): ReactNode {
	return (
		<>
			<HomeHeroSection />
			<HomeAboutSection />
		</>
	);
}
