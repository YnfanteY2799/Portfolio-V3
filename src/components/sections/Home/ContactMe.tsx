"use client";
import Balatro from "@/components/ui/backgrounds/balatro";
import { useState, type ReactNode } from "react";
import { m as motion } from "motion/react";
import {
	Mail,
	MessageSquare,
	Send,
	MapPin,
	Phone,
	Linkedin,
	Github,
	Twitter,
	Calendar,
	Download,
	ExternalLink,
	CheckCircle2,
	Sparkles,
	Clock,
	Globe,
	ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Cards";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

export default function ContactMeSection(): ReactNode {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		subject: "",
		message: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		// Simulate form submission
		await new Promise((resolve) => setTimeout(resolve, 2000));
		setIsSubmitting(false);
		setIsSubmitted(true);
		setTimeout(() => setIsSubmitted(false), 3000);
		setFormData({ name: "", email: "", subject: "", message: "" });
	};

	const contactMethods = [
		{
			icon: Mail,
			label: "Email",
			value: "hello@example.com",
			href: "mailto:hello@example.com",
			color: "from-blue-500 to-cyan-500",
		},
		{
			icon: Phone,
			label: "Phone",
			value: "+1 (555) 123-4567",
			href: "tel:+15551234567",
			color: "from-green-500 to-emerald-500",
		},
		{
			icon: MapPin,
			label: "Location",
			value: "San Francisco, CA",
			href: "#",
			color: "from-orange-500 to-red-500",
		},
	];

	const socialLinks = [
		{ icon: Github, label: "GitHub", href: "https://github.com", color: "hover:text-purple-500" },
		{ icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com", color: "hover:text-blue-500" },
		{ icon: Twitter, label: "Twitter", href: "https://twitter.com", color: "hover:text-cyan-500" },
	];

	const availability = [
		{ day: "Mon-Fri", hours: "9:00 AM - 6:00 PM PST", available: true },
		{ day: "Weekends", hours: "By appointment", available: false },
	];

	return (
		<section id="Contact_Me" className="relative isolate overflow-hidden bg-background min-h-screen">
			{/* Background */}
			<div className="absolute inset-0 -z-10">
				<Balatro color1="#de443b" color2="#162325" color3="#006BB4" pixelFilter={2000} />
			</div>
			{/* Backdrop */}
			<div className="absolute inset-0 -z-5 bg-black/75 backdrop-blur-sm" />
			{/* Content */}
			<div className="relative z-10 p-8">
				<div className="container mx-auto relative z-10">
					<motion.div
						initial={{ opacity: 0, y: 50 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
						viewport={{ once: true }}
						className="text-center mb-16">
						<div className="flex items-center justify-center gap-3 mb-6">
							<h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-playfair text-foreground">Get In Touch</h2>
						</div>
						<p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
							Have a project in mind? Let's discuss how we can work together
						</p>
					</motion.div>

					{/* Bento Grid Layout */}
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
						{/* Contact Form - Large Card */}
						<motion.div
							initial={{ opacity: 0, y: 50 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							viewport={{ once: true }}
							className="lg:col-span-2 lg:row-span-2">
							<Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-500 overflow-hidden group">
								<CardContent className="p-8 md:p-10 h-full">
									<div className="flex items-center gap-3 mb-6">
										<div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
											<Send className="w-6 h-6 text-white" />
										</div>
										<div>
											<h3 className="text-2xl font-bold text-foreground">Send a Message</h3>
											<p className="text-sm text-muted-foreground">I'll get back to you within 24 hours</p>
										</div>
									</div>

									<form onSubmit={handleSubmit} className="space-y-6">
										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div>
												<label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
													Name
												</label>
												<input
													type="text"
													id="name"
													required
													value={formData.name}
													onChange={(e) => setFormData({ ...formData, name: e.target.value })}
													className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all duration-300"
													placeholder="John Doe"
												/>
											</div>
											<div>
												<label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
													Email
												</label>
												<input
													type="email"
													id="email"
													required
													value={formData.email}
													onChange={(e) => setFormData({ ...formData, email: e.target.value })}
													className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all duration-300"
													placeholder="john@example.com"
												/>
											</div>
										</div>

										<div>
											<label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
												Subject
											</label>
											<input
												type="text"
												id="subject"
												required
												value={formData.subject}
												onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
												className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all duration-300"
												placeholder="Project Inquiry"
											/>
										</div>

										<div>
											<label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
												Message
											</label>
											<textarea
												id="message"
												required
												rows={6}
												value={formData.message}
												onChange={(e) => setFormData({ ...formData, message: e.target.value })}
												className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all duration-300 resize-none"
												placeholder="Tell me about your project..."
											/>
										</div>

										<Button type="submit" size="xl" disabled={isSubmitting || isSubmitted}>
											{isSubmitting ? (
												<>
													<motion.div
														animate={{ rotate: 360 }}
														transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
														className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
													/>
													Sending...
												</>
											) : isSubmitted ? (
												<>
													<CheckCircle2 className="w-5 h-5 mr-2" />
													Message Sent!
												</>
											) : (
												<>
													<Send className="w-5 h-5 mr-2" />
													Send Message
												</>
											)}
										</Button>
									</form>
								</CardContent>
							</Card>
						</motion.div>

						{/* Contact Methods - Vertical Stack */}
						<div className="space-y-6">
							{contactMethods.map((method, index) => {
								const Icon = method.icon;
								return (
									<motion.div
										key={method.label}
										initial={{ opacity: 0, x: 50 }}
										whileInView={{ opacity: 1, x: 0 }}
										transition={{ duration: 0.6, delay: index * 0.1 }}
										viewport={{ once: true }}
										whileHover={{ scale: 1.05, x: -5 }}>
										<a href={method.href}>
											<Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 overflow-hidden group cursor-pointer">
												<CardContent className="p-6">
													<div className="flex items-center gap-4">
														<div
															className={`w-14 h-14 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
															<Icon className="w-7 h-7 text-white" />
														</div>
														<div className="flex-1">
															<div className="text-sm text-muted-foreground mb-1">{method.label}</div>
															<div className="font-medium text-foreground group-hover:text-primary transition-colors">{method.value}</div>
														</div>
														<ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
													</div>
												</CardContent>
											</Card>
										</a>
									</motion.div>
								);
							})}
						</div>

						{/* Social Links - Horizontal Card */}
						<motion.div
							initial={{ opacity: 0, y: 50 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							viewport={{ once: true }}
							className="lg:col-span-1">
							<Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-500">
								<CardContent className="p-6">
									<div className="flex items-center gap-2 mb-4">
										<Globe className="w-5 h-5 text-primary" />
										<h4 className="font-semibold text-foreground">Social Media</h4>
									</div>
									<div className="flex gap-3">
										{socialLinks.map((social, index) => {
											const Icon = social.icon;
											return (
												<motion.a
													key={social.label}
													href={social.href}
													target="_blank"
													rel="noopener noreferrer"
													initial={{ opacity: 0, scale: 0 }}
													whileInView={{ opacity: 1, scale: 1 }}
													transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
													viewport={{ once: true }}
													whileHover={{ scale: 1.2, rotate: 5 }}
													className={`w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-muted-foreground ${social.color} transition-all duration-300`}>
													<Icon className="w-5 h-5" />
												</motion.a>
											);
										})}
									</div>
								</CardContent>
							</Card>
						</motion.div>

						{/* Availability - Tall Card */}
						<motion.div
							initial={{ opacity: 0, y: 50 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.3 }}
							viewport={{ once: true }}
							className="lg:col-span-2 lg:row-span-1">
							<Card className="h-full bg-gradient-to-br from-primary/5 via-purple-500/5 to-background border-border/50 hover:border-primary/30 transition-all duration-500">
								<CardContent className="p-6">
									<div className="flex items-center gap-2 mb-4">
										<Clock className="w-5 h-5 text-primary" />
										<h4 className="font-semibold text-foreground">Availability</h4>
									</div>
									<div className="space-y-3">
										{availability.map((slot, index) => (
											<motion.div
												key={slot.day}
												initial={{ opacity: 0, x: -20 }}
												whileInView={{ opacity: 1, x: 0 }}
												transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
												viewport={{ once: true }}
												className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
												<div>
													<div className="font-medium text-foreground">{slot.day}</div>
													<div className="text-sm text-muted-foreground">{slot.hours}</div>
												</div>
												<Badge variant={slot.available ? "default" : "secondary"} className="font-medium">
													{slot.available ? "Available" : "Limited"}
												</Badge>
											</motion.div>
										))}
									</div>

									<Button variant="outline" className="w-full mt-4 group bg-transparent">
										<a href="#" className="flex items-center justify-center gap-2">
											<Calendar className="w-4 h-4" />
											Schedule a Meeting
											<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
										</a>
									</Button>
								</CardContent>
							</Card>
						</motion.div>

						{/* Quick Actions */}
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							whileInView={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.6, delay: 0.4 }}
							viewport={{ once: true }}
							className="lg:col-span-1">
							<Card className="h-full bg-gradient-to-br from-primary to-primary/80 text-white border-0 overflow-hidden group cursor-pointer hover:scale-105 transition-transform duration-300">
								<CardContent className="p-6 relative">
									<div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
									<div className="relative z-10">
										<Sparkles className="w-8 h-8 mb-3" />
										<h4 className="font-bold text-lg mb-2">Download CV</h4>
										<p className="text-sm text-white/80 mb-4">Get my full resume and portfolio</p>
										<Button variant="secondary" size="sm" className="group-hover:scale-110 transition-transform">
											<Download className="w-4 h-4 mr-2" />
											Download
										</Button>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					</div>
				</div>
			</div>
		</section>
	);
}
