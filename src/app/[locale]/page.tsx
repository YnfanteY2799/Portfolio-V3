import { HeroSection, AboutSection, TechStackSection, GitHubActivitySection, ProjectSection, TestimonialsSection } from "@/components/sections";
import { FloatingSidebar } from "@/components/ui/Navbar/Floating";

import type { ReactNode } from "react";

export default function Home(): ReactNode {
	return (
		<>
			<FloatingSidebar />
			<HeroSection />
			<AboutSection />
			<TechStackSection />
			{/* <GitHubActivitySection /> */}
			{/* <ProjectSection /> */}
			{/* <TestimonialsSection /> */}
		</>
	);
}
