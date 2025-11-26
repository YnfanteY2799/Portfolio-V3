import { m } from "motion/react";

import type { ITechCardProps } from "@/types/components";
import type { ReactNode } from "react";
import { Card, CardContent } from "../Cards/index.tsx";
import { cn } from "@/utils/functions";

export default function TechCards({ name, color, category, description, Icon, proficiency, idx }: ITechCardProps): ReactNode {
	return (
		<m.div
			key={name}
			viewport={{ once: true }}
			initial={{ opacity: 0, y: 50 }}
			whileInView={{ opacity: 1, y: 0 }}
			className="group hover:cursor-pointer"
			transition={{ duration: 0.4, delay: idx * 0.1, type: "spring", stiffness: 200 }}
			whileHover={{ y: -10, scale: 1.03, transition: { duration: 0.2, type: "spring", stiffness: 400 } }}>
			<Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 h-full overflow-hidden">
				{/* Gradient background on hover */}
				<div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300", color)} />
				<CardContent className="p-2 relative">
					<div className="relative z-10">
						<div className="flex items-center justify-between mb-4">
							<m.div className="text-3xl" whileHover={{ scale: 1.2, rotate: 10, transition: { duration: 0.2, type: "spring", stiffness: 400 } }}>
								{Icon}
							</m.div>
							<span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">{category}</span>
						</div>

						<h3 className="text-xl font-semibold text-foreground mb-3">{name}</h3>
						<p className="text-sm text-muted-foreground mb-4 leading-relaxed">{description}</p>

						{/* Proficiency bar */}
						<div className="space-y-2">
							<div className="flex justify-between text-xs text-muted-foreground">
								<span>Proficiency</span>
								<span>{proficiency}%</span>
							</div>
							<div className="w-full bg-muted/30 rounded-full h-2">
								<m.div
									className={cn("h-2 rounded-full bg-gradient-to-r", color)}
									transition={{ duration: 1, delay: idx * 0.1 }}
									whileInView={{ width: `${proficiency}%` }}
									viewport={{ once: true }}
									initial={{ width: 0 }}
								/>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</m.div>
	);
}
