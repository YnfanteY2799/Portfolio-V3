"use client";
import { Card, CardContent } from "@/components/ui/card";
import { m } from "motion/react";

import type { IAboutCardProps } from "@/types/components.ts";
import type { ReactNode } from "react";

export default function AboutCard({ Icon, description, gradient, title, idx = 0 }: IAboutCardProps): ReactNode {
	return (
		<m.div
			key={title}
			viewport={{ once: true }}
			initial={{ opacity: 0, y: 50 }}
			whileInView={{ opacity: 1, y: 0 }}
			className="group flex-1 hover:cursor-pointer"
			transition={{ duration: 0.4, delay: idx * 0.1, type: "spring", stiffness: 200 }}
			whileHover={{ y: -15, scale: 1.02, transition: { duration: 0.2, type: "spring", stiffness: 400 } }}>
			<Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 h-full overflow-hidden">
				<div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
				<CardContent className="text-center relative">
					<m.div
						whileHover={{ scale: 1.2, rotate: 10, transition: { duration: 0.2, type: "spring", stiffness: 400 } }}
						className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl mb-6 relative z-10`}>
						<Icon className="w-8 h-8 text-white" />
					</m.div>
					<h3 className="text-xl font-semibold text-foreground mb-4 relative z-10">{title}</h3>
					<p className="text-muted-foreground leading-relaxed relative z-10">{description}</p>
				</CardContent>
			</Card>
		</m.div>
	);
}
