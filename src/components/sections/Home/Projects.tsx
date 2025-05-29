"use client";
import { ExternalLink, Github, Search, X, SortAsc, Sparkles, Grid, List } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Button from "@/components/ui/button";
import { useState, useMemo } from "react";
import Badge from "@/components/ui/badge";
import Input from "@/components/ui/input";

import { motion, AnimatePresence } from "framer-motion";

const projects = [
	{
		title: "E-Commerce Platform",
		description: "A full-stack e-commerce solution built with Next.js, Stripe, and PostgreSQL featuring real-time inventory management.",
		image: "/placeholder.svg?height=300&width=400",
		tags: ["Next.js", "TypeScript", "Stripe", "PostgreSQL"],
		category: "Full Stack",
		type: "Web Application",
		date: "2024",
		github: "#",
		live: "#",
		featured: true,
		height: "tall",
	},
	{
		title: "AI Task Management",
		description: "Intelligent task management with AI-powered prioritization and real-time collaboration features.",
		image: "/placeholder.svg?height=250&width=350",
		tags: ["React", "Node.js", "OpenAI", "Socket.io"],
		category: "AI/ML",
		type: "SaaS",
		date: "2024",
		github: "#",
		live: "#",
		height: "medium",
	},
	{
		title: "Weather Analytics Dashboard",
		description: "Beautiful weather analytics with interactive charts, forecasts, and climate data visualization.",
		image: "/placeholder.svg?height=200&width=300",
		tags: ["React", "D3.js", "OpenWeather API"],
		category: "Frontend",
		type: "Dashboard",
		date: "2023",
		github: "#",
		live: "#",
		height: "short",
	},
	{
		title: "Blockchain Wallet",
		description: "Secure cryptocurrency wallet with multi-chain support and DeFi integration.",
		image: "/placeholder.svg?height=280&width=380",
		tags: ["React Native", "Web3", "Ethereum", "Solidity"],
		category: "Blockchain",
		type: "Mobile App",
		date: "2023",
		github: "#",
		live: "#",
		height: "medium",
	},
	{
		title: "Social Media Analytics",
		description: "Comprehensive analytics platform for social media metrics with beautiful data visualizations.",
		image: "/placeholder.svg?height=220&width=320",
		tags: ["Vue.js", "Python", "FastAPI", "PostgreSQL"],
		category: "Full Stack",
		type: "Analytics",
		date: "2023",
		github: "#",
		live: "#",
		height: "short",
	},
	{
		title: "AR Shopping Experience",
		description: "Augmented reality shopping app that lets users visualize products in their space.",
		image: "/placeholder.svg?height=260&width=340",
		tags: ["React Native", "ARKit", "Three.js", "Node.js"],
		category: "AR/VR",
		type: "Mobile App",
		date: "2022",
		github: "#",
		live: "#",
		height: "tall",
	},
];

const categories = ["All", "Full Stack", "Frontend", "AI/ML", "Blockchain", "AR/VR"];
const types = ["All", "Web Application", "Mobile App", "SaaS", "Dashboard", "Analytics"];
const sortOptions = ["Date", "Title", "Category"];

export default function ProjectsSection() {
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [selectedType, setSelectedType] = useState("All");
	const [searchQuery, setSearchQuery] = useState("");
	const [showSearch, setShowSearch] = useState(false);
	const [sortBy, setSortBy] = useState("Date");
	const [isAnimating, setIsAnimating] = useState(false);
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

	const filteredAndSortedProjects = useMemo(() => {
		const filtered = projects.filter((project) => {
			const categoryMatch = selectedCategory === "All" || project.category === selectedCategory;
			const typeMatch = selectedType === "All" || project.type === selectedType;
			const searchMatch =
				searchQuery === "" ||
				project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
				project.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

			return categoryMatch && typeMatch && searchMatch;
		});

		// Sort projects
		filtered.sort((a, b) => {
			switch (sortBy) {
				case "Title":
					return a.title.localeCompare(b.title);
				case "Category":
					return a.category.localeCompare(b.category);
				case "Date":
				default:
					return Number.parseInt(b.date) - Number.parseInt(a.date);
			}
		});

		return filtered;
	}, [selectedCategory, selectedType, searchQuery, sortBy]);

	const handleFilterChange = async (filterType: string, value: string) => {
		setIsAnimating(true);

		// Staggered exit animation
		await new Promise((resolve) => setTimeout(resolve, 200));

		if (filterType === "category") {
			setSelectedCategory(value);
		} else if (filterType === "type") {
			setSelectedType(value);
		} else if (filterType === "sort") {
			setSortBy(value);
		}

		// Staggered entrance animation
		setTimeout(() => setIsAnimating(false), 100);
	};

	const clearFilters = async () => {
		setIsAnimating(true);
		await new Promise((resolve) => setTimeout(resolve, 200));

		setSelectedCategory("All");
		setSelectedType("All");
		setSearchQuery("");
		setSortBy("Date");

		setTimeout(() => setIsAnimating(false), 100);
	};

	const toggleSearch = () => {
		setShowSearch(!showSearch);
		if (showSearch) {
			setSearchQuery("");
		}
	};

	const getProjectHeight = (height: string) => {
		switch (height) {
			case "tall":
				return "md:row-span-2";
			case "medium":
				return "md:row-span-1";
			case "short":
				return "md:row-span-1";
			default:
				return "md:row-span-1";
		}
	};

	return (
		<section id="projects" className="py-16 md:py-24 px-4 md:px-6 bg-muted/20">
			<div className="container mx-auto">
				<motion.div
					initial={{ opacity: 0, y: 50 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
					viewport={{ once: true }}
					className="text-center mb-12 md:mb-20">
					<div className="flex items-center justify-center gap-3 mb-6">
						<Sparkles className="w-6 h-6 md:w-8 md:h-8 text-primary" />
						<h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-playfair text-foreground">Featured Projects</h2>
					</div>
					<p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto px-4">
						A showcase of my recent work and creative experiments that push the boundaries of technology
					</p>
				</motion.div>

				{/* Three.js Showcase */}
				{/* <motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					whileInView={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
					viewport={{ once: true }}
					className="mb-12 md:mb-16">
					<ThreeJSShowcase />
				</motion.div> */}

				{/* Enhanced Filters with Mobile Optimization */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
					className="mb-8 md:mb-12">
					<div className="bg-card/30 backdrop-blur-xl border border-border/50 rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-2xl">
						<div className="flex flex-col gap-6 md:gap-8">
							{/* Filter Header */}
							<div className="text-center">
								<h3 className="text-base md:text-lg font-semibold text-foreground mb-2">Filter & Search Projects</h3>
								<p className="text-sm text-muted-foreground">Discover projects that match your interests</p>
							</div>

							{/* Main Filter Controls */}
							<div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
								{/* Category Filter */}
								<div className="space-y-3">
									<div className="flex items-center gap-2">
										<div className="w-2 h-2 bg-primary rounded-full"></div>
										<span className="text-sm font-medium text-foreground">Category</span>
									</div>
									<div className="grid grid-cols-2 gap-2">
										{categories.map((category) => (
											<motion.div key={category} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
												<Button
													variant={selectedCategory === category ? "default" : "outline"}
													size="sm"
													onClick={() => handleFilterChange("category", category)}
													className={`w-full rounded-xl text-xs font-medium transition-all duration-300 ${
														selectedCategory === category
															? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
															: "hover:bg-primary/10 hover:border-primary/50"
													}`}>
													{category}
												</Button>
											</motion.div>
										))}
									</div>
								</div>

								{/* Type Filter */}
								<div className="space-y-3">
									<div className="flex items-center gap-2">
										<div className="w-2 h-2 bg-secondary rounded-full"></div>
										<span className="text-sm font-medium text-foreground">Type</span>
									</div>
									<div className="grid grid-cols-2 gap-2">
										{types.map((type) => (
											<motion.div key={type} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
												<Button
													variant={selectedType === type ? "default" : "outline"}
													size="sm"
													onClick={() => handleFilterChange("type", type)}
													className={`w-full rounded-xl text-xs font-medium transition-all duration-300 ${
														selectedType === type
															? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
															: "hover:bg-primary/10 hover:border-primary/50"
													}`}>
													{type}
												</Button>
											</motion.div>
										))}
									</div>
								</div>

								{/* Sort Options */}
								<div className="space-y-3">
									<div className="flex items-center gap-2">
										<SortAsc className="w-4 h-4 text-primary" />
										<span className="text-sm font-medium text-foreground">Sort By</span>
									</div>
									<div className="grid grid-cols-3 gap-2">
										{sortOptions.map((option) => (
											<motion.div key={option} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
												<Button
													variant={sortBy === option ? "default" : "outline"}
													size="sm"
													onClick={() => handleFilterChange("sort", option)}
													className={`w-full rounded-xl text-xs font-medium transition-all duration-300 ${
														sortBy === option
															? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
															: "hover:bg-primary/10 hover:border-primary/50"
													}`}>
													{option}
												</Button>
											</motion.div>
										))}
									</div>
								</div>

								{/* Search & View Options */}
								<div className="space-y-4">
									{/* Search Bar */}
									<div className="space-y-3">
										<div className="flex items-center gap-2">
											<Search className="w-4 h-4 text-primary" />
											<span className="text-sm font-medium text-foreground">Search</span>
										</div>
										<div className="relative">
											<AnimatePresence>
												{showSearch ? (
													<motion.div
														initial={{ height: 0, opacity: 0 }}
														animate={{ height: "auto", opacity: 1 }}
														exit={{ height: 0, opacity: 0 }}
														transition={{ duration: 0.3, ease: "easeInOut" }}
														className="overflow-hidden">
														<Input
															placeholder="Search projects..."
															value={searchQuery}
															onChange={(e) => setSearchQuery(e.target.value)}
															className="w-full rounded-xl bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background/80 transition-all duration-300"
														/>
													</motion.div>
												) : (
													<Button
														variant="outline"
														onClick={toggleSearch}
														className="w-full rounded-xl hover:bg-primary/10 hover:border-primary/50 transition-all duration-300">
														<Search className="w-4 h-4 mr-2" />
														Search
													</Button>
												)}
											</AnimatePresence>
										</div>
									</div>

									{/* View Mode Toggle */}
									<div className="space-y-3">
										<span className="text-sm font-medium text-foreground">View</span>
										<div className="grid grid-cols-2 gap-2">
											<Button
												variant={viewMode === "grid" ? "default" : "outline"}
												size="sm"
												onClick={() => setViewMode("grid")}
												className="rounded-xl">
												<Grid className="w-4 h-4 mr-1" />
												Grid
											</Button>
											<Button
												variant={viewMode === "list" ? "default" : "outline"}
												size="sm"
												onClick={() => setViewMode("list")}
												className="rounded-xl">
												<List className="w-4 h-4 mr-1" />
												List
											</Button>
										</div>
									</div>
								</div>
							</div>

							{/* Action Buttons */}
							<div className="flex items-center justify-between pt-4 border-t border-border/50">
								<div className="flex items-center gap-4">
									<motion.div
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{ opacity: 1, scale: 1 }}
										className="text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
										{filteredAndSortedProjects.length} of {projects.length} projects
									</motion.div>
									{(selectedCategory !== "All" || selectedType !== "All" || searchQuery || sortBy !== "Date") && (
										<motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
											<div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
											<span className="text-xs text-primary font-medium">Filters Active</span>
										</motion.div>
									)}
								</div>

								<div className="flex items-center gap-3">
									{showSearch && (
										<Button variant="ghost" size="sm" onClick={toggleSearch} className="rounded-xl text-muted-foreground hover:text-foreground">
											<X className="w-4 h-4" />
										</Button>
									)}
									<Button
										variant="outline"
										size="sm"
										onClick={clearFilters}
										className="rounded-xl hover:bg-destructive/10 hover:border-destructive/50 hover:text-destructive transition-all duration-300">
										Clear All
									</Button>
								</div>
							</div>
						</div>
					</div>
				</motion.div>

				{/* Enhanced Projects Grid with Engaging Filter Animations */}
				<AnimatePresence mode="wait">
					<motion.div
						key={`${selectedCategory}-${selectedType}-${searchQuery}-${sortBy}-${viewMode}`}
						initial={{ opacity: 0 }}
						animate={{ opacity: isAnimating ? 0.3 : 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.4, ease: "easeInOut" }}>
						{/* Filter Animation Overlay */}
						<AnimatePresence>
							{isAnimating && (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
									<motion.div
										initial={{ scale: 0, rotate: 0 }}
										animate={{ scale: 1, rotate: 360 }}
										exit={{ scale: 0, rotate: 720 }}
										transition={{ duration: 0.6, ease: "easeInOut" }}
										className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
									/>
									<motion.div
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -20 }}
										transition={{ delay: 0.2 }}
										className="absolute mt-24 text-primary font-medium">
										Filtering projects...
									</motion.div>
								</motion.div>
							)}
						</AnimatePresence>

						{/* Projects Display */}
						<div
							className={
								viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 auto-rows-max" : "space-y-4 md:space-y-6"
							}>
							{filteredAndSortedProjects.map((project, index) => (
								<motion.div
									key={project.title}
									initial={{
										opacity: 0,
										y: 100,
										scale: 0.8,
										rotateX: 45,
										z: -100,
									}}
									animate={{
										opacity: 1,
										y: 0,
										scale: 1,
										rotateX: 0,
										z: 0,
									}}
									transition={{
										duration: 0.8,
										delay: index * 0.1,
										type: "spring",
										stiffness: 100,
										damping: 15,
									}}
									whileHover={{
										y: -15,
										scale: 1.02,
										rotateY: viewMode === "grid" ? 5 : 0,
										z: 50,
										transition: {
											duration: 0.3,
											type: "spring",
											stiffness: 400,
											damping: 25,
										},
									}}
									className={`group ${viewMode === "grid" ? getProjectHeight(project.height) : ""} perspective-1000`}
									style={{ transformStyle: "preserve-3d" }}>
									<Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-500 overflow-hidden h-full shadow-xl hover:shadow-2xl group-hover:shadow-primary/20">
										{viewMode === "grid" ? (
											<>
												{/* Grid View */}
												<div className="relative overflow-hidden">
													<div className="relative overflow-hidden">
														<motion.img
															src={project.image}
															alt={project.title}
															className="w-full h-48 md:h-auto object-cover transition-transform duration-700"
															whileHover={{ scale: 1.1 }}
															style={{ transformOrigin: "center center" }}
														/>

														{/* Gradient Overlay */}
														<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

														{/* Floating Action Buttons */}
														<motion.div
															className="absolute inset-0 flex items-center justify-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
															initial={{ y: 20 }}
															whileHover={{ y: 0 }}>
															<motion.div whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.95 }}>
																<Button
																	size="sm"
																	variant="outline"
																	className="text-white border-white/50 hover:bg-white hover:text-black backdrop-blur-sm bg-black/20">
																	<Github className="w-4 h-4 mr-2" />
																	Code
																</Button>
															</motion.div>
															<motion.div whileHover={{ scale: 1.1, rotate: -5 }} whileTap={{ scale: 0.95 }}>
																<Button size="sm" className="bg-primary/90 hover:bg-primary text-white backdrop-blur-sm shadow-lg">
																	<ExternalLink className="w-4 h-4 mr-2" />
																	Live
																</Button>
															</motion.div>
														</motion.div>
													</div>

													{/* Enhanced Badges */}
													<div className="absolute top-4 left-4 flex flex-col gap-2">
														<motion.div
															initial={{ x: -50, opacity: 0 }}
															animate={{ x: 0, opacity: 1 }}
															transition={{ delay: index * 0.1 + 0.3 }}>
															<Badge variant="secondary" className="text-xs bg-background/90 backdrop-blur-sm shadow-lg">
																{project.category}
															</Badge>
														</motion.div>
														<motion.div
															initial={{ x: -50, opacity: 0 }}
															animate={{ x: 0, opacity: 1 }}
															transition={{ delay: index * 0.1 + 0.4 }}>
															<Badge variant="outline" className="text-xs bg-background/90 backdrop-blur-sm shadow-lg">
																{project.type}
															</Badge>
														</motion.div>
													</div>

													{/* Date Badge */}
													<div className="absolute top-4 right-4">
														<motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: index * 0.1 + 0.5 }}>
															<Badge variant="outline" className="text-xs bg-background/90 backdrop-blur-sm shadow-lg">
																{project.date}
															</Badge>
														</motion.div>
													</div>

													{/* Featured Sparkle */}
													{project.featured && (
														<motion.div
															className="absolute top-4 right-16"
															initial={{ scale: 0, rotate: -180 }}
															animate={{ scale: 1, rotate: 0 }}
															transition={{ delay: index * 0.1 + 0.6, type: "spring", stiffness: 200 }}>
															<div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
																<Sparkles className="w-4 h-4 text-white" />
															</div>
														</motion.div>
													)}
												</div>

												<CardContent className="p-4 md:p-6 relative">
													<motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: index * 0.1 + 0.7 }}>
														<h3 className="text-lg md:text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors leading-tight">
															{project.title}
														</h3>

														<p className="text-muted-foreground mb-4 leading-relaxed text-sm">{project.description}</p>

														{/* Animated Tags */}
														<div className="flex flex-wrap gap-2 mb-4">
															{project.tags.map((tag, tagIndex) => (
																<motion.div
																	key={tag}
																	initial={{ scale: 0, opacity: 0 }}
																	animate={{ scale: 1, opacity: 1 }}
																	transition={{
																		delay: index * 0.1 + 0.8 + tagIndex * 0.05,
																		type: "spring",
																		stiffness: 300,
																	}}
																	whileHover={{ scale: 1.1 }}>
																	<Badge variant="secondary" className="text-xs hover:bg-primary/20 transition-colors">
																		{tag}
																	</Badge>
																</motion.div>
															))}
														</div>

														{/* Project Stats */}
														<motion.div
															className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border/50"
															initial={{ opacity: 0 }}
															animate={{ opacity: 1 }}
															transition={{ delay: index * 0.1 + 1 }}>
															<span className="flex items-center gap-1">
																<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
																Active
															</span>
															<span>{project.date}</span>
														</motion.div>
													</motion.div>

													{/* Hover Glow Effect */}
													<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
												</CardContent>
											</>
										) : (
											/* List View */
											<CardContent className="p-4 md:p-6">
												<div className="flex flex-col md:flex-row gap-4 md:gap-6">
													<div className="w-full md:w-48 flex-shrink-0">
														<img
															src={project.image || "/placeholder.svg"}
															alt={project.title}
															className="w-full h-32 md:h-24 object-cover rounded-lg"
														/>
													</div>
													<div className="flex-1 min-w-0">
														<div className="flex flex-col md:flex-row md:items-start justify-between mb-2">
															<h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
																{project.title}
															</h3>
															<div className="flex items-center gap-2 mt-2 md:mt-0">
																<Badge variant="secondary" className="text-xs">
																	{project.category}
																</Badge>
																<Badge variant="outline" className="text-xs">
																	{project.date}
																</Badge>
															</div>
														</div>
														<p className="text-muted-foreground text-sm mb-3 leading-relaxed">{project.description}</p>
														<div className="flex flex-wrap gap-2 mb-3">
															{project.tags.map((tag) => (
																<Badge key={tag} variant="secondary" className="text-xs">
																	{tag}
																</Badge>
															))}
														</div>
														<div className="flex items-center gap-2">
															<Button size="sm" variant="outline" className="text-xs">
																<Github className="w-3 h-3 mr-1" />
																Code
															</Button>
															<Button size="sm" className="text-xs">
																<ExternalLink className="w-3 h-3 mr-1" />
																Live
															</Button>
														</div>
													</div>
												</div>
											</CardContent>
										)}
									</Card>
								</motion.div>
							))}
						</div>
					</motion.div>
				</AnimatePresence>

				{/* No Results Message */}
				{filteredAndSortedProjects.length === 0 && (
					<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
						<div className="max-w-md mx-auto">
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								transition={{ type: "spring", stiffness: 200 }}
								className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
								<Search className="w-8 h-8 text-muted-foreground" />
							</motion.div>
							<p className="text-muted-foreground text-lg mb-4">No projects found matching your criteria.</p>
							<Button variant="outline" onClick={clearFilters} className="rounded-xl">
								Clear Filters
							</Button>
						</div>
					</motion.div>
				)}
			</div>
		</section>
	);
}
