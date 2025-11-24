import {
	HeroSection,
	AboutSection,
	TechStackSection,
	GitHubActivitySection,
	ProjectSection,
	TestimonialsSection,
	ContactMeSection,
} from "@/components/sections";
import { FloatingSidebar } from "@/components/ui/Navbar/Floating";
import Navbar from "@/components/ui/Navbar";

import type { ReactNode } from "react";

export default function Home(): ReactNode {
	return (
		<>
			<Navbar />
			<FloatingSidebar />
			<HeroSection />
			<AboutSection />
			<TechStackSection />
			{/* <GitHubActivitySection /> */}
			{/* <ProjectSection /> */}
			{/* <TestimonialsSection /> */}
			<ContactMeSection />
			
		</>
	);
}
