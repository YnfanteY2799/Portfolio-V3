import { HeroSection, AboutSection, TechStackSection, GitHubActivitySection, ProjectSection, TestimonialsSection } from "@/components/sections";

import type { ReactNode } from "react";

export default function Home(): ReactNode {
	return (
		<>
			<HeroSection />
			<AboutSection />
			<TechStackSection />
			{/* <GitHubActivitySection /> */}
			{/* <ProjectSection /> */}
			{/* <TestimonialsSection /> */}
		</>
	);
}
