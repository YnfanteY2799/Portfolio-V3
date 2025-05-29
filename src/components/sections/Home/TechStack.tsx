"use client";
import BlurOnScroll from "@/components/ui/HOC/BlurOnScroll";
import { Card, CardContent } from "@/components/ui/card";
import { m as motion } from "motion/react";
import { type ReactNode } from "react";

const technologies = [
	{
		name: "React",
		category: "Frontend",
		description: "A JavaScript library for building user interfaces with component-based architecture.",
		icon: "⚛️",
		proficiency: 95,
		color: "from-blue-400 to-blue-600",
	},
	{
		name: "Next.js",
		category: "Frontend",
		description: "The React framework for production with server-side rendering and static generation.",
		icon: "▲",
		proficiency: 90,
		color: "from-gray-700 to-gray-900",
	},
	{
		name: "TypeScript",
		category: "Language",
		description: "Typed superset of JavaScript that compiles to plain JavaScript.",
		icon: "📘",
		proficiency: 88,
		color: "from-blue-500 to-blue-700",
	},
	{
		name: "Node.js",
		category: "Backend",
		description: "JavaScript runtime built on Chrome's V8 JavaScript engine for server-side development.",
		icon: "🟢",
		proficiency: 85,
		color: "from-green-500 to-green-700",
	},
	{
		name: "Python",
		category: "Backend",
		description: "High-level programming language with elegant syntax and powerful libraries.",
		icon: "🐍",
		proficiency: 80,
		color: "from-yellow-400 to-yellow-600",
	},
	{
		name: "PostgreSQL",
		category: "Database",
		description: "Advanced open-source relational database with strong SQL compliance.",
		icon: "🐘",
		proficiency: 82,
		color: "from-blue-600 to-indigo-600",
	},
	{
		name: "AWS",
		category: "Cloud",
		description: "Comprehensive cloud computing platform with extensive service offerings.",
		icon: "☁️",
		proficiency: 75,
		color: "from-orange-400 to-orange-600",
	},
	{
		name: "Docker",
		category: "DevOps",
		description: "Platform for developing, shipping, and running applications in containers.",
		icon: "🐳",
		proficiency: 78,
		color: "from-blue-500 to-cyan-500",
	},
];

export default function HomeTechStackSection(): ReactNode {
	return (
		<section id="tech-stack" className="py-10 px-6">
			<BlurOnScroll className="container mx-auto" transitionDuration={1.5}>
				<motion.div
					viewport={{ once: true }}
					className="text-center mb-15"
					initial={{ opacity: 0, y: 50 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, type: "spring", stiffness: 100 }}>
					<h2 className="text-5xl md:text-6xl font-bold font-playfair text-foreground mb-6">Tech Stack</h2>
					<p className="text-lg text-muted-foreground max-w-3xl mx-auto">
						Technologies and tools I use to bring ideas to life with precision and creativity
					</p>
				</motion.div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
					{technologies.map((tech, index) => (
						<motion.div
							key={tech.name}
							viewport={{ once: true }}
							initial={{ opacity: 0, y: 50 }}
							whileInView={{ opacity: 1, y: 0 }}
							className="group hover:cursor-pointer"
							transition={{ duration: 0.4, delay: index * 0.1, type: "spring", stiffness: 200 }}
							whileHover={{ y: -10, scale: 1.03, transition: { duration: 0.2, type: "spring", stiffness: 400 } }}>
							<Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 h-full overflow-hidden">
								{/* Gradient background on hover */}
								<div
									className={`absolute inset-0 bg-gradient-to-br ${tech.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
								<CardContent className="p-2 relative">
									<div className="relative z-10">
										<div className="flex items-center justify-between mb-4">
											<motion.div
												className="text-3xl"
												whileHover={{ scale: 1.2, rotate: 10, transition: { duration: 0.2, type: "spring", stiffness: 400 } }}>
												{tech.icon}
											</motion.div>
											<span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">{tech.category}</span>
										</div>

										<h3 className="text-xl font-semibold text-foreground mb-3">{tech.name}</h3>
										<p className="text-sm text-muted-foreground mb-4 leading-relaxed">{tech.description}</p>

										{/* Proficiency bar */}
										<div className="space-y-2">
											<div className="flex justify-between text-xs text-muted-foreground">
												<span>Proficiency</span>
												<span>{tech.proficiency}%</span>
											</div>
											<div className="w-full bg-muted/30 rounded-full h-2">
												<motion.div
													className={`h-2 rounded-full bg-gradient-to-r ${tech.color}`}
													transition={{ duration: 1, delay: index * 0.1 }}
													whileInView={{ width: `${tech.proficiency}%` }}
													viewport={{ once: true }}
													initial={{ width: 0 }}
												/>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</div>
			</BlurOnScroll>
		</section>
	);
}
