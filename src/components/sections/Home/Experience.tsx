"use client";
import { Calendar, MapPin, Award, TrendingUp, Filter, Briefcase, GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import { useState } from "react";

const experiences = [
	{
		title: "Senior Full Stack Developer",
		company: "TechCorp Inc.",
		location: "San Francisco, CA",
		period: "2022 - Present",
		type: "work",
		description:
			"Leading development of scalable web applications using React, Node.js, and AWS. Mentoring junior developers and architecting microservices for enterprise-level solutions.",
		achievements: [
			"Increased application performance by 40%",
			"Led a team of 5 developers",
			"Implemented CI/CD pipelines reducing deployment time by 60%",
			"Architected microservices handling 1M+ daily requests",
		],
		skills: ["React", "Node.js", "AWS", "Docker", "TypeScript"],
		category: "Full-time",
		color: "from-blue-500 to-cyan-500",
	},
	{
		title: "Full Stack Developer",
		company: "StartupXYZ",
		location: "Austin, TX",
		period: "2020 - 2022",
		type: "work",
		description:
			"Developed and maintained multiple client projects using modern web technologies. Collaborated with design teams to create pixel-perfect implementations and optimized user experiences.",
		achievements: [
			"Built 15+ client projects from concept to deployment",
			"Reduced average page load times by 60%",
			"Implemented responsive designs for mobile-first approach",
			"Mentored 3 junior developers",
		],
		skills: ["React", "Vue.js", "Python", "PostgreSQL", "Figma"],
		category: "Full-time",
		color: "from-purple-500 to-pink-500",
	},
	{
		title: "Computer Science Degree",
		company: "University of Technology",
		location: "California, USA",
		period: "2016 - 2020",
		type: "education",
		description:
			"Bachelor's degree in Computer Science with focus on software engineering, algorithms, and data structures. Graduated Magna Cum Laude with 3.8 GPA.",
		achievements: [
			"Graduated Magna Cum Laude (3.8 GPA)",
			"President of Computer Science Club",
			"Published research on machine learning algorithms",
			"Dean's List for 6 consecutive semesters",
		],
		skills: ["Java", "Python", "C++", "Data Structures", "Algorithms"],
		category: "Education",
		color: "from-green-500 to-emerald-500",
	},
	{
		title: "Frontend Developer",
		company: "Digital Agency",
		location: "Remote",
		period: "2019 - 2020",
		type: "work",
		description:
			"Specialized in creating interactive user interfaces and animations. Worked closely with UX designers to bring creative concepts to life using modern frontend technologies.",
		achievements: [
			"Created 20+ interactive websites with custom animations",
			"Improved user engagement metrics by 35%",
			"Mastered modern CSS techniques and JavaScript frameworks",
			"Collaborated with international teams across 5 time zones",
		],
		skills: ["JavaScript", "CSS3", "GSAP", "Three.js", "Webpack"],
		category: "Contract",
		color: "from-orange-500 to-red-500",
	},
];

const filterOptions = ["All", "Work", "Education"];
const categoryOptions = ["All", "Full-time", "Contract", "Education"];

export default function ExperienceSection() {
	const [selectedFilter, setSelectedFilter] = useState("All");
	const [selectedCategory, setSelectedCategory] = useState("All");

	const filteredExperiences = experiences.filter((exp) => {
		const typeMatch =
			selectedFilter === "All" ||
			(selectedFilter === "Work" && exp.type === "work") ||
			(selectedFilter === "Education" && exp.type === "education");

		const categoryMatch = selectedCategory === "All" || exp.category === selectedCategory;

		return typeMatch && categoryMatch;
	});

	return (
		<section id="experience" className="py-24 px-6">
			<div className="container mx-auto">
				<motion.div
					initial={{ opacity: 0, y: 50 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
					viewport={{ once: true }}
					className="text-center mb-20">
					<h2 className="text-5xl md:text-6xl font-bold font-playfair text-foreground mb-6">Experience</h2>
					<p className="text-lg text-muted-foreground max-w-3xl mx-auto">
						My professional journey and educational background that shaped my career in technology
					</p>
				</motion.div>

				{/* Enhanced Filters */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
					className="mb-12">
					<div className="flex flex-col md:flex-row gap-6 items-center justify-center">
						<div className="flex items-center gap-2">
							<Filter className="w-4 h-4 text-muted-foreground" />
							<span className="text-sm font-medium text-muted-foreground">Type:</span>
							<div className="flex flex-wrap gap-2">
								{filterOptions.map((option) => (
									<Button
										key={option}
										variant={selectedFilter === option ? "default" : "outline"}
										size="sm"
										onClick={() => setSelectedFilter(option)}
										className="rounded-full text-xs">
										{option === "Work" && <Briefcase className="w-3 h-3 mr-1" />}
										{option === "Education" && <GraduationCap className="w-3 h-3 mr-1" />}
										{option}
									</Button>
								))}
							</div>
						</div>

						<div className="flex items-center gap-2">
							<span className="text-sm font-medium text-muted-foreground">Category:</span>
							<div className="flex flex-wrap gap-2">
								{categoryOptions.map((category) => (
									<Button
										key={category}
										variant={selectedCategory === category ? "default" : "outline"}
										size="sm"
										onClick={() => setSelectedCategory(category)}
										className="rounded-full text-xs">
										{category}
									</Button>
								))}
							</div>
						</div>
					</div>
				</motion.div>

				<div className="max-w-6xl mx-auto">
					<div className="relative">
						{/* Enhanced Timeline line with gradient and glow */}
						<div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-1 h-full">
							<div className="w-full h-full bg-gradient-to-b from-primary via-primary/70 to-primary/30 rounded-full shadow-lg shadow-primary/20"></div>
							<div className="absolute inset-0 w-full h-full bg-gradient-to-b from-primary/50 via-primary/30 to-transparent rounded-full blur-sm"></div>
						</div>

						<AnimatePresence mode="wait">
							<motion.div
								key={`${selectedFilter}-${selectedCategory}`}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.3 }}>
								{filteredExperiences.map((experience, index) => (
									<motion.div
										key={`${experience.title}-${experience.company}`}
										initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
										whileInView={{ opacity: 1, x: 0 }}
										transition={{
											duration: 0.6,
											delay: index * 0.2,
											type: "spring",
											stiffness: 100,
										}}
										viewport={{ once: true }}
										className={`relative flex items-center mb-16 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
										{/* Enhanced Timeline dot with pulsing animation */}
										<motion.div
											className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-full border-4 border-background shadow-xl z-10 flex items-center justify-center"
											whileHover={{ scale: 1.3 }}
											transition={{ type: "spring", stiffness: 400 }}
											animate={{
												boxShadow: ["0 0 20px rgba(139, 92, 246, 0.3)", "0 0 30px rgba(139, 92, 246, 0.6)", "0 0 20px rgba(139, 92, 246, 0.3)"],
											}}
											style={{
												animationDuration: "2s",
												animationIterationCount: "infinite",
											}}>
											{experience.type === "work" ? (
												<Briefcase className="w-3 h-3 text-white" />
											) : (
												<GraduationCap className="w-3 h-3 text-white" />
											)}
										</motion.div>

										{/* Content */}
										<div className={`w-full md:w-5/12 ml-16 md:ml-0 ${index % 2 === 0 ? "md:pr-12" : "md:pl-12"}`}>
											<motion.div
												whileHover={{
													scale: 1.02,
													y: -8,
													transition: { duration: 0.2, type: "spring", stiffness: 400 },
												}}
												className="group">
												<Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 overflow-hidden">
													<CardContent className="p-8 relative">
														{/* Gradient background on hover */}
														<div
															className={`absolute inset-0 bg-gradient-to-br ${experience.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

														<div className="relative z-10">
															<div className="flex items-center justify-between mb-4">
																<div className="flex items-center gap-3">
																	<Calendar className="w-4 h-4 text-primary" />
																	<span className="text-sm font-medium text-primary">{experience.period}</span>
																</div>
																<Badge variant="outline" className="text-xs">
																	{experience.category}
																</Badge>
															</div>

															<h3 className="text-2xl font-bold text-foreground mb-2">{experience.title}</h3>
															<div className="flex items-center gap-2 text-muted-foreground mb-4">
																<span className="font-medium text-lg">{experience.company}</span>
																<span>•</span>
																<div className="flex items-center gap-1">
																	<MapPin className="w-3 h-3" />
																	<span className="text-sm">{experience.location}</span>
																</div>
															</div>

															<p className="text-muted-foreground mb-6 leading-relaxed">{experience.description}</p>

															{/* Skills */}
															<div className="mb-6">
																<h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
																	<TrendingUp className="w-4 h-4" />
																	Key Technologies
																</h4>
																<div className="flex flex-wrap gap-2">
																	{experience.skills.map((skill) => (
																		<Badge key={skill} variant="secondary" className="text-xs">
																			{skill}
																		</Badge>
																	))}
																</div>
															</div>

															{/* Achievements */}
															<div className="space-y-3">
																<h4 className="text-sm font-medium text-foreground flex items-center gap-2">
																	<Award className="w-4 h-4" />
																	Key Achievements
																</h4>
																{experience.achievements.map((achievement, achievementIndex) => (
																	<motion.div
																		key={achievementIndex}
																		initial={{ opacity: 0, x: -20 }}
																		whileInView={{ opacity: 1, x: 0 }}
																		transition={{ delay: achievementIndex * 0.1 }}
																		viewport={{ once: true }}
																		className="flex items-start gap-3 text-sm text-muted-foreground">
																		<div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
																		<span className="leading-relaxed">{achievement}</span>
																	</motion.div>
																))}
															</div>
														</div>
													</CardContent>
												</Card>
											</motion.div>
										</div>
									</motion.div>
								))}
							</motion.div>
						</AnimatePresence>
					</div>
				</div>
			</div>
		</section>
	);
}
