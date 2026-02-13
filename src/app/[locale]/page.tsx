import { HeroSection, AboutSection, TechStackSection, ContactMeSection } from "@/components/sections";
import { SeasonalBackground } from "@/components/ui/backgrounds/SeasonalBackground";
import { FloatingSidebar } from "@/components/ui/Navbar/Floating";
import Navbar from "@/components/ui/Navbar";

import type { ReactNode } from "react";

export default function Home(): ReactNode {
	return (
		<>
			<Navbar />
			<SeasonalBackground />
			<main role="main" className="relative min-h-screen">
				<FloatingSidebar />
				<HeroSection />
				<AboutSection />
				<TechStackSection />
				{/* <GitHubActivitySection /> */}
				{/* <ProjectSection /> */}
				{/* <TestimonialsSection /> */}
				{/* <ContactMeSection /> */}
			</main>
		</>
	);
}
