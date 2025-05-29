import {
	HomeHeroSection,
	HomeAboutSection,
	HomeTechStackSection,
	GitHubActivitySection,
	HomeProjectSection,
	HomeExperienceSection,
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
			{/* <HomeExperienceSection /> */}
		</>
	);
}
