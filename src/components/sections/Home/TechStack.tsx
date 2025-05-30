"use client";
import { default_technologies } from "@/utils/constants/icons";
import BlurOnScroll from "@/components/ui/HOC/BlurOnScroll";
import TechCards from "@/components/ui/Cards/TechCards";
import { m } from "motion/react";

import type { ITechStackProps } from "@/types/components";
import type { ReactNode } from "react";

export default function TechStackSection({ technologies = default_technologies }: ITechStackProps): ReactNode {
	return (
		<section id="Tech_Stack" className="py-10 px-6">
			<BlurOnScroll className="container mx-auto" transitionDuration={1.5}>
				<m.div
					viewport={{ once: true }}
					className="text-center mb-15"
					initial={{ opacity: 0, y: 50 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, type: "spring", stiffness: 100 }}>
					<h2 className="text-5xl md:text-6xl font-bold font-playfair text-foreground mb-6">Tech Stack</h2>
					<p className="text-lg text-muted-foreground max-w-3xl mx-auto">
						Technologies and tools I use to bring ideas to life with precision and creativity
					</p>
				</m.div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
					{technologies.map((tech, i) => (
						<TechCards idx={i} {...tech} />
					))}
				</div>
			</BlurOnScroll>
		</section>
	);
}
