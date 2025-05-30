"use client";
import BlurOnScroll from "@/components/ui/HOC/BlurOnScroll";
import AboutCard from "@/components/ui/Cards/AboutCards";
import { default_attributes } from "@/utils/constants";
import { m } from "motion/react";

import type { IAboutSectionProps } from "@/types/components";
import type { ReactNode } from "react";

export default function AboutSection({ attributes = default_attributes }: IAboutSectionProps): ReactNode {
	return (
		<section id="About_Me" className="py-24 px-6 bg-muted/20">
			<BlurOnScroll className="container mx-auto" transitionDuration={1.5}>
				<m.div
					viewport={{ once: true }}
					className="text-center mb-20"
					initial={{ opacity: 0, y: 50 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, type: "spring", stiffness: 100 }}>
					<h2 className="text-5xl md:text-6xl font-bold font-playfair text-foreground mb-6">About Me</h2>
					<p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
						I'm a passionate full-stack developer with over 5 years of experience creating digital experiences that combine beautiful design with
						robust functionality. I specialize in React, Node.js, and modern web technologies, always striving to write clean, efficient code
						that makes a difference.
					</p>
				</m.div>

				{/* Single line layout for cards */}
				<div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
					{attributes.map((atr, i) => (
						<AboutCard {...atr} idx={i} key={i} />
					))}
				</div>
			</BlurOnScroll>
		</section>
	);
}
