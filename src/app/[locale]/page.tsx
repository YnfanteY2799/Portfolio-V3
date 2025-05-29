import {
	HomeHeroSection,
	HomeAboutSection,
	HomeTechStackSection,
	GitHubActivitySection,
	HomeProjectSection,
	TestimonialsSection,
} from "@/components/sections";
import type { ReactNode } from "react";

export default function Home(): ReactNode {
	return (
		<>
			<HomeHeroSection />
			<HomeAboutSection />
			<HomeTechStackSection />
			<GitHubActivitySection />
			<HomeProjectSection />
			<TestimonialsSection />
		</>
	);
}
