"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, Download, FileText, Eye, Share2, ChevronLeft } from "lucide-react";
import Button from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
// import CVPreview from "@/components/cv-preview";
import Badge from "@/components/ui/badge";

interface CVDownloadModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export default function CVDownloadModal({ isOpen, onClose }: CVDownloadModalProps) {
	const [showPreview, setShowPreview] = useState(false);
	const [selectedCV, setSelectedCV] = useState<string | null>(null);

	const cvVersions = [
		{
			name: "Full CV",
			description: "Complete professional resume with all experience and projects",
			format: "PDF",
			size: "2.4 MB",
			pages: 3,
			recommended: true,
			previewData: {
				name: "John Doe",
				title: "Full Stack Developer & Creative Technologist",
				email: "john.doe@example.com",
				phone: "+1 (555) 123-4567",
				location: "San Francisco, CA",
				website: "johndoe.dev",
				summary:
					"Passionate full-stack developer with 5+ years of experience creating digital experiences that combine beautiful design with robust functionality.",
				experience: [
					{
						title: "Senior Full Stack Developer",
						company: "TechCorp Inc.",
						period: "2022 - Present",
						description: "Leading development of scalable web applications using React, Node.js, and AWS.",
					},
					{
						title: "Full Stack Developer",
						company: "StartupXYZ",
						period: "2020 - 2022",
						description: "Developed and maintained multiple client projects using modern web technologies.",
					},
				],
				skills: ["React", "Node.js", "TypeScript", "AWS", "Docker", "PostgreSQL"],
				education: "B.S. Computer Science, University of Technology (2016-2020)",
			},
		},
		{
			name: "One Page Resume",
			description: "Condensed version highlighting key achievements and skills",
			format: "PDF",
			size: "1.1 MB",
			pages: 1,
			recommended: false,
			previewData: {
				name: "John Doe",
				title: "Full Stack Developer",
				email: "john.doe@example.com",
				phone: "+1 (555) 123-4567",
				location: "San Francisco, CA",
				website: "johndoe.dev",
				summary: "Experienced developer specializing in React and Node.js with a passion for creating exceptional user experiences.",
				experience: [
					{
						title: "Senior Full Stack Developer",
						company: "TechCorp Inc.",
						period: "2022 - Present",
						description: "Leading development of scalable applications.",
					},
				],
				skills: ["React", "Node.js", "TypeScript", "AWS"],
				education: "B.S. Computer Science (2020)",
			},
		},
		{
			name: "Developer Portfolio",
			description: "Technical resume focused on programming skills and projects",
			format: "PDF",
			size: "1.8 MB",
			pages: 2,
			recommended: false,
			previewData: {
				name: "John Doe",
				title: "Software Engineer & Technical Lead",
				email: "john.doe@example.com",
				phone: "+1 (555) 123-4567",
				location: "San Francisco, CA",
				website: "johndoe.dev",
				summary: "Technical leader with expertise in modern web technologies, cloud architecture, and team management.",
				experience: [
					{
						title: "Senior Full Stack Developer",
						company: "TechCorp Inc.",
						period: "2022 - Present",
						description: "Architecting microservices and leading technical initiatives.",
					},
					{
						title: "Technical Lead",
						company: "StartupXYZ",
						period: "2020 - 2022",
						description: "Led development team and established technical standards.",
					},
				],
				skills: ["React", "Node.js", "TypeScript", "AWS", "Docker", "Kubernetes", "PostgreSQL", "Redis"],
				education: "B.S. Computer Science, University of Technology",
			},
		},
	];

	const handleDownload = (version: string) => {
		console.log(`Downloading ${version}`);
		onClose();
	};

	const handlePreview = (cvName: string) => {
		setSelectedCV(cvName);
		setShowPreview(true);
	};

	const handleShare = () => {
		if (navigator.share) {
			navigator.share({
				title: "John Doe's CV",
				text: "Check out my professional resume",
				url: window.location.href,
			});
		} else {
			navigator.clipboard.writeText(window.location.href);
		}
	};

	const selectedCVData = cvVersions.find((cv) => cv.name === selectedCV);

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
					onClick={onClose}>
					<motion.div
						initial={{ opacity: 0, scale: 0.9, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.9, y: 20 }}
						transition={{ type: "spring", stiffness: 300, damping: 30 }}
						className="w-full max-w-6xl max-h-[90vh] overflow-hidden"
						onClick={(e) => e.stopPropagation()}>
						<Card className="bg-background/95 backdrop-blur-xl border border-border/50 shadow-2xl h-full">
							<CardContent className="p-0 h-full flex flex-col">
								{/* Header */}
								<div className="flex items-center justify-between p-6 border-b border-border/50 flex-shrink-0">
									<div>
										<h2 className="text-2xl font-bold font-playfair text-foreground">
											{showPreview ? `Preview: ${selectedCV}` : "Download CV"}
										</h2>
										<p className="text-muted-foreground mt-1">
											{showPreview ? "Interactive CV preview" : "Choose the version that best fits your needs"}
										</p>
									</div>
									<div className="flex items-center gap-2">
										{showPreview && (
											<Button variant="outline" onClick={() => setShowPreview(false)} className="rounded-lg">
												<ChevronLeft className="w-4 h-4 mr-2" />
												Back
											</Button>
										)}
										<Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-muted/50">
											<X className="w-5 h-5" />
										</Button>
									</div>
								</div>

								{/* Content */}
								<div className="flex-1 overflow-hidden">
									<AnimatePresence mode="wait">
										{showPreview ? (
											<motion.div
												key="preview"
												initial={{ opacity: 0, x: 20 }}
												animate={{ opacity: 1, x: 0 }}
												exit={{ opacity: 0, x: -20 }}
												className="h-full">
												{/* <CVPreview cvData={selectedCVData?.previewData} onDownload={() => handleDownload(selectedCV!)} /> */}
											</motion.div>
										) : (
											<motion.div
												key="list"
												initial={{ opacity: 0, x: -20 }}
												animate={{ opacity: 1, x: 0 }}
												exit={{ opacity: 0, x: 20 }}
												className="p-6 space-y-4 overflow-y-auto h-full">
												{cvVersions.map((cv, index) => (
													<motion.div
														key={cv.name}
														initial={{ opacity: 0, y: 20 }}
														animate={{ opacity: 1, y: 0 }}
														transition={{ delay: index * 0.1 }}
														whileHover={{ scale: 1.02 }}
														className="group">
														<Card className="border border-border/50 hover:border-primary/50 transition-all duration-300 overflow-hidden">
															<CardContent className="p-4">
																<div className="flex items-start justify-between">
																	<div className="flex items-start space-x-4 flex-1">
																		<div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
																			<FileText className="w-6 h-6 text-primary" />
																		</div>
																		<div className="flex-1 min-w-0">
																			<div className="flex items-center gap-2 mb-1">
																				<h3 className="font-semibold text-foreground">{cv.name}</h3>
																				{cv.recommended && (
																					<Badge className="text-xs bg-primary/20 text-primary border-primary/30">Recommended</Badge>
																				)}
																			</div>
																			<p className="text-sm text-muted-foreground mb-3 leading-relaxed">{cv.description}</p>
																			<div className="flex items-center gap-4 text-xs text-muted-foreground">
																				<span className="flex items-center gap-1">
																					<div className="w-2 h-2 bg-primary rounded-full"></div>
																					{cv.format}
																				</span>
																				<span>{cv.size}</span>
																				<span>
																					{cv.pages} page{cv.pages > 1 ? "s" : ""}
																				</span>
																			</div>
																		</div>
																	</div>
																	<div className="flex items-center gap-2 ml-4">
																		<Button
																			variant="outline"
																			size="sm"
																			onClick={() => handlePreview(cv.name)}
																			className="rounded-lg hover:bg-muted/50">
																			<Eye className="w-4 h-4 mr-2" />
																			Preview
																		</Button>
																		<Button
																			size="sm"
																			onClick={() => handleDownload(cv.name)}
																			className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg">
																			<Download className="w-4 h-4 mr-2" />
																			Download
																		</Button>
																	</div>
																</div>
															</CardContent>
														</Card>
													</motion.div>
												))}

												{/* Footer Actions */}
												<div className="flex items-center justify-between pt-6 border-t border-border/50 bg-muted/20 rounded-lg p-4 mt-6">
													<div className="text-sm text-muted-foreground">Last updated: December 2024</div>
													<div className="flex items-center gap-3">
														<Button variant="outline" size="sm" onClick={handleShare} className="rounded-lg hover:bg-muted/50">
															<Share2 className="w-4 h-4 mr-2" />
															Share
														</Button>
													</div>
												</div>
											</motion.div>
										)}
									</AnimatePresence>
								</div>
							</CardContent>
						</Card>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
