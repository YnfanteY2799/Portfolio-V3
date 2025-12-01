"use client";
import { TestimonialsSlideVariants, TestimonialsTransitionVariants } from "@/utils/variants/animations";
import { ChevronLeft, ChevronRight, Star, Quote, Play, Pause, RotateCcw } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/Cards";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Image from "next/image";

const testimonials = [
	{
		id: 1,
		name: "Sarah Chen",
		role: "Product Manager",
		company: "TechFlow Inc.",
		image: "/placeholder.svg?height=80&width=80",
		rating: 5,
		text: "John's ability to translate complex requirements into elegant solutions is remarkable. His attention to detail and commitment to quality made our project a huge success.",
		project: "E-commerce Platform",
		color: "from-blue-500/20 to-cyan-500/20",
		accentColor: "border-blue-500/30",
	},
	{
		id: 2,
		name: "Michael Rodriguez",
		role: "CTO",
		company: "StartupXYZ",
		image: "/placeholder.svg?height=80&width=80",
		rating: 5,
		text: "Working with John was a game-changer for our startup. He delivered a scalable architecture that grew with our business and exceeded all performance expectations.",
		project: "SaaS Platform",
		color: "from-purple-500/20 to-pink-500/20",
		accentColor: "border-purple-500/30",
	},
	{
		id: 3,
		name: "Emily Watson",
		role: "Design Director",
		company: "Creative Studios",
		image: "/placeholder.svg?height=80&width=80",
		rating: 5,
		text: "John brings designs to life with pixel-perfect precision. His understanding of both design and development creates seamless collaboration and outstanding results.",
		project: "Portfolio Website",
		color: "from-green-500/20 to-emerald-500/20",
		accentColor: "border-green-500/30",
	},
	{
		id: 4,
		name: "David Kim",
		role: "Founder",
		company: "InnovateLab",
		image: "/placeholder.svg?height=80&width=80",
		rating: 5,
		text: "John's technical expertise and problem-solving skills are exceptional. He consistently delivers high-quality code and innovative solutions that drive business growth.",
		project: "Analytics Dashboard",
		color: "from-orange-500/20 to-red-500/20",
		accentColor: "border-orange-500/30",
	},
	{
		id: 5,
		name: "Lisa Thompson",
		role: "Marketing Director",
		company: "GrowthCorp",
		image: "/placeholder.svg?height=80&width=80",
		rating: 5,
		text: "The website John built for us increased our conversion rate by 40%. His focus on user experience and performance optimization made all the difference.",
		project: "Marketing Website",
		color: "from-indigo-500/20 to-purple-500/20",
		accentColor: "border-indigo-500/30",
	},
	{
		id: 6,
		name: "Alex Johnson",
		role: "Lead Developer",
		company: "DevTeam Pro",
		image: "/placeholder.svg?height=80&width=80",
		rating: 5,
		text: "John's code quality and architectural decisions are top-notch. He's a true professional who brings both technical excellence and creative thinking to every project.",
		project: "API Development",
		color: "from-teal-500/20 to-cyan-500/20",
		accentColor: "border-teal-500/30",
	},
];

export default function TestimonialsSection() {
	const [isAutoPlaying, setIsAutoPlaying] = useState(true);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isPaused, setIsPaused] = useState(false);
	const [direction, setDirection] = useState(0);

	const goToNext = useCallback(() => {
		setDirection(() => 1);
		setCurrentIndex((prev) => (prev + 1) % testimonials.length);
	}, []);

	const goToPrevious = useCallback(() => {
		setDirection(-1);
		setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
	}, []);

	const goToSlide = useCallback(
		(i: number) => {
			setDirection(() => (i > currentIndex ? 1 : -1));
			setCurrentIndex(() => i);
		},
		[currentIndex]
	);

	const resetCarousel = useCallback(() => {
		setDirection(() => 1);
		setCurrentIndex(() => 0);
		setIsAutoPlaying(() => true);
		setIsPaused(() => false);
	}, []);

	const toggleAutoPlay = useCallback(() => {
		setIsAutoPlaying((old) => !old);
		setIsPaused((old) => !old);
	}, [isAutoPlaying, isPaused]);

	function handleKeyPress({ key, ...e }: KeyboardEvent): void {
		switch (key) {
			case "ArrowLeft":
				goToPrevious();
				break;
			case "ArrowRight":
				goToNext();
				break;
			case " ":
				e.preventDefault();
				toggleAutoPlay();
				break;
			case "Home":
				goToSlide(0);
				break;
			case "End":
				goToSlide(testimonials.length - 1);
				break;
		}
	}

	useEffect(() => {
		if (!isAutoPlaying || isPaused) return;
		const interval = setInterval(goToNext, 5000);
		return () => clearInterval(interval);
	}, [isAutoPlaying, isPaused, goToNext]);

	// Keyboard navigation
	useEffect(() => {
		window.addEventListener("keydown", handleKeyPress);
		return () => window.removeEventListener("keydown", handleKeyPress);
	}, [goToNext, goToPrevious, goToSlide, toggleAutoPlay]);

	const currentTestimonial = testimonials[currentIndex];

	return (
		<section className="py-24 px-6 bg-gradient-to-br from-background via-muted/10 to-background overflow-hidden">
			<div className="container mx-auto">
				{/* Header */}
				<motion.div
					viewport={{ once: true }}
					className="text-center mb-20"
					initial={{ opacity: 0, y: 50 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, type: "spring", stiffness: 100 }}>
					<h2 className="text-5xl md:text-6xl font-bold font-playfair text-foreground mb-6">What Clients Say</h2>
					<p className="text-lg text-muted-foreground max-w-3xl mx-auto">
						Testimonials from amazing clients who trusted me with their projects and achieved remarkable results
					</p>
				</motion.div>

				{/* Main Carousel */}
				<div className="relative max-w-6xl mx-auto">
					{/* Main Testimonial Card */}
					<div className="relative h-[500px] flex items-center justify-center perspective-1000">
						<AnimatePresence initial={false} custom={direction} mode="wait">
							<motion.div
								exit="exit"
								initial="enter"
								animate="center"
								custom={direction}
								key={currentIndex}
								variants={TestimonialsSlideVariants}
								className="absolute w-full max-w-4xl"
								transition={TestimonialsTransitionVariants}>
								<Card className={`relative overflow-hidden border-2 ${currentTestimonial.accentColor} bg-card/50 backdrop-blur-sm shadow-2xl`}>
									{/* Glass Background */}
									<div className={`absolute inset-0 bg-gradient-to-br ${currentTestimonial.color} opacity-60`}></div>
									<div className="absolute inset-0 backdrop-blur-sm"></div>

									<CardContent className="relative z-10 p-12">
										<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
											{/* Client Info */}
											<div className="text-center lg:text-left">
												<motion.div
													initial={{ scale: 0, rotate: -180 }}
													animate={{ scale: 1, rotate: 0 }}
													transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
													className="relative inline-block mb-6">
													<div className="w-24 h-24 mx-auto lg:mx-0 rounded-full overflow-hidden border-4 border-primary/30 shadow-xl">
														<Image
															src="/placeholder.svg"
															alt={currentTestimonial.name}
															width={100}
															height={100}
															className="w-full h-full object-cover"
														/>
													</div>
													<div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
														<Quote className="w-4 h-4 text-white" />
													</div>
												</motion.div>

												<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
													<h3 className="text-2xl font-bold text-foreground mb-2">{currentTestimonial.name}</h3>
													<p className="text-primary font-medium mb-1">{currentTestimonial.role}</p>
													<p className="text-muted-foreground text-sm mb-4">{currentTestimonial.company}</p>

													{/* Rating */}
													<div className="flex items-center justify-center lg:justify-start gap-1 mb-4">
														{[...Array(currentTestimonial.rating)].map((_, i) => (
															<motion.div
																key={i}
																initial={{ opacity: 0, scale: 0 }}
																animate={{ opacity: 1, scale: 1 }}
																transition={{ delay: 0.4 + i * 0.1 }}>
																<Star className="w-5 h-5 text-yellow-400 fill-current" />
															</motion.div>
														))}
													</div>

													<Badge variant="outline" className="text-xs">
														{currentTestimonial.project}
													</Badge>
												</motion.div>
											</div>

											{/* Testimonial Text */}
											<div className="lg:col-span-2">
												<motion.div
													initial={{ opacity: 0, y: 30 }}
													animate={{ opacity: 1, y: 0 }}
													transition={{ delay: 0.4 }}
													className="relative">
													<Quote className="absolute -top-4 -left-4 w-12 h-12 text-primary/20" />
													<blockquote className="text-xl lg:text-2xl text-foreground leading-relaxed font-medium italic pl-8">
														"{currentTestimonial.text}"
													</blockquote>
												</motion.div>
											</div>
										</div>
									</CardContent>
								</Card>
							</motion.div>
						</AnimatePresence>
					</div>

					{/* Enhanced Navigation Controls */}
					<div className="flex items-center justify-center mt-12 gap-6">
						<Button
							variant="outline"
							size="icon"
							onClick={goToPrevious}
							className="rounded-full w-12 h-12 border-2 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
							aria-label="Previous testimonial">
							<ChevronLeft className="w-5 h-5" />
						</Button>

						{/* Dots Indicator with Progress */}
						<div className="flex items-center gap-3">
							{testimonials.map((_, index) => (
								<motion.button
									key={index}
									onClick={() => goToSlide(index)}
									className={`relative w-3 h-3 rounded-full transition-all duration-300 ${
										index === currentIndex ? "bg-primary scale-125" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
									}`}
									whileHover={{ scale: 1.2 }}
									whileTap={{ scale: 0.9 }}
									aria-label={`Go to testimonial ${index + 1}`}>
									{index === currentIndex && isAutoPlaying && !isPaused && (
										<motion.div
											className="absolute inset-0 rounded-full border-2 border-primary"
											initial={{ scale: 1 }}
											animate={{ scale: 1.5, opacity: 0 }}
											transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
										/>
									)}
								</motion.button>
							))}
						</div>

						<Button
							variant="outline"
							size="icon"
							onClick={goToNext}
							className="rounded-full w-12 h-12 border-2 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
							aria-label="Next testimonial">
							<ChevronRight className="w-5 h-5" />
						</Button>
					</div>

					{/* Enhanced Control Panel */}
					<div className="flex justify-center items-center gap-4 mt-6">
						<Button
							variant="ghost"
							size="sm"
							onClick={toggleAutoPlay}
							className="text-muted-foreground hover:text-foreground transition-colors"
							aria-label={isAutoPlaying ? "Pause autoplay" : "Start autoplay"}>
							{isAutoPlaying && !isPaused ? (
								<>
									<Pause className="w-4 h-4 mr-2" />
									Pause
								</>
							) : (
								<>
									<Play className="w-4 h-4 mr-2" />
									Play
								</>
							)}
						</Button>

						<Button
							variant="ghost"
							size="sm"
							onClick={resetCarousel}
							className="text-muted-foreground hover:text-foreground transition-colors"
							aria-label="Reset carousel">
							<RotateCcw className="w-4 h-4 mr-2" />
							Reset
						</Button>

						<div className="text-xs text-muted-foreground">
							{currentIndex + 1} / {testimonials.length}
						</div>
					</div>
				</div>

				{/* Stats Section */}
				<motion.div
					initial={{ opacity: 0, y: 50 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.3 }}
					viewport={{ once: true }}
					className="mt-20">
					<Card className="bg-card/50 backdrop-blur-sm border-border/50 max-w-4xl mx-auto">
						<CardContent className="p-8">
							<div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
								<div>
									<div className="text-3xl font-bold text-primary mb-2">50+</div>
									<div className="text-sm text-muted-foreground">Happy Clients</div>
								</div>
								<div>
									<div className="text-3xl font-bold text-primary mb-2">100+</div>
									<div className="text-sm text-muted-foreground">Projects Completed</div>
								</div>
								<div>
									<div className="text-3xl font-bold text-primary mb-2">5.0</div>
									<div className="text-sm text-muted-foreground">Average Rating</div>
								</div>
								<div>
									<div className="text-3xl font-bold text-primary mb-2">98%</div>
									<div className="text-sm text-muted-foreground">Client Satisfaction</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</motion.div>
			</div>
		</section>
	);
}
