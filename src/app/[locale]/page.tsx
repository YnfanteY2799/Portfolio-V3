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
import Balatro from "@/components/ui/backgrounds/balatro";
import ContactSection from "@/components/sections/Home/Contact";

export default function Home(): ReactNode {
	return (
		<>
			<Navbar />
			<FloatingSidebar />
			<HeroSection />
			<AboutSection />
			<TechStackSection />
			<ContactMeSection />
			<ContactSection />
			{/* <GitHubActivitySection /> */}
			{/* <ProjectSection /> */}
			{/* <TestimonialsSection /> */}
		</>
	);
}
