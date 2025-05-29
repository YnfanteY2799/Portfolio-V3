"use client";
import { Code, Palette, Rocket, Users, Zap } from "lucide-react";
import BlurOnScroll from "@/components/ui/HOC/BlurOnScroll";
import { Card, CardContent } from "@/components/ui/card";
import { type ReactNode } from "react";
import { m } from "motion/react";

const attributes = [
	{
		icon: Code,
		title: "Problem Solver",
		description: "I love tackling complex challenges and finding elegant solutions through code.",
		gradient: "from-blue-500 to-cyan-500",
	},
	{
		icon: Palette,
		title: "Creative Designer",
		description: "Combining aesthetics with functionality to create beautiful user experiences.",
		gradient: "from-purple-500 to-pink-500",
	},
	{
		icon: Rocket,
		title: "Innovation Driven",
		description: "Always exploring new technologies and pushing the boundaries of what's possible.",
		gradient: "from-orange-500 to-red-500",
	},
	{
		icon: Users,
		title: "Team Player",
		description: "Collaborative approach to development with strong communication skills.",
		gradient: "from-green-500 to-emerald-500",
	},
	{
		icon: Zap,
		title: "Fast Learner",
		description: "Quick to adapt to new technologies and frameworks in the ever-evolving tech landscape.",
		gradient: "from-yellow-500 to-orange-500",
	},
];

export default function HomeAboutSection(): ReactNode {
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
					{attributes.map((attribute, index) => (
						<m.div
							key={attribute.title}
							viewport={{ once: true }}
							initial={{ opacity: 0, y: 50 }}
							whileInView={{ opacity: 1, y: 0 }}
							className="group flex-1 hover:cursor-pointer"
							transition={{ duration: 0.4, delay: index * 0.1, type: "spring", stiffness: 200 }}
							whileHover={{ y: -15, scale: 1.02, transition: { duration: 0.2, type: "spring", stiffness: 400 } }}>
							<Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 h-full overflow-hidden">
								{/* Gradient background on hover */}
								<div
									className={`absolute inset-0 bg-gradient-to-br ${attribute.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
								<CardContent className="text-center relative">
									<m.div
										whileHover={{ scale: 1.2, rotate: 10, transition: { duration: 0.2, type: "spring", stiffness: 400 } }}
										className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${attribute.gradient} rounded-2xl mb-6 relative z-10`}>
										<attribute.icon className="w-8 h-8 text-white" />
									</m.div>

									<h3 className="text-xl font-semibold text-foreground mb-4 relative z-10">{attribute.title}</h3>
									<p className="text-muted-foreground leading-relaxed relative z-10">{attribute.description}</p>
								</CardContent>
							</Card>
						</m.div>
					))}
				</div>
			</BlurOnScroll>
		</section>
	);
}
