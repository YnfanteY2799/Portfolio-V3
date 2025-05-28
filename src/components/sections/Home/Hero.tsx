"use client";
import BlurOnScroll from "@/components/ui/HOC/BlurOnScroll";
import { type ReactNode } from "react";
import { m } from "motion/react";
import Image from "next/image";

export default function HomeHeroSection(): ReactNode {
	return (
		<section id="About_Me" className="relative isolate overflow-hidden bg-background">
			<BlurOnScroll className="mx-auto max-w-7xl px-6 py-20 lg:flex items-center lg:gap-x-10 lg:px-8" transitionDuration={2}>
				<m.div
					animate={{ opacity: 1, y: 0 }}
					initial={{ opacity: 0, y: 50 }}
					transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
					className="mx-auto max-w-2xl lg:mx-0 lg:max-w-lg lg:flex-shrink-0">
					<m.h1
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						initial={{ opacity: 0, y: 20 }}
						className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
						<span className="text-gradient">Flowers & Saints</span>
					</m.h1>
					<m.p
						animate={{ opacity: 1, y: 0 }}
						initial={{ opacity: 0, y: 20 }}
						transition={{ duration: 0.8, delay: 0.2 }}
						className="mt-6 text-lg leading-8 text-muted-foreground">
						Where minimal design meets floral artistry. We craft elegant experiences that inspire and elevate your space.
					</m.p>
					<m.div
						animate={{ opacity: 1, y: 0 }}
						initial={{ opacity: 0, y: 20 }}
						transition={{ duration: 0.8, delay: 0.4 }}
						className="mt-10 flex items-center gap-x-6">
						XD
					</m.div>
				</m.div>

				<m.div
					animate={{ opacity: 1, x: 0 }}
					initial={{ opacity: 0, x: 20 }}
					className="mx-auto mt-16 lg:mt-0"
					transition={{ duration: 0.8, delay: 0.6 }}>
					<Image
						width={100}
						height={100}
						src="/dudul.svg"
						alt="Basic Doodle"
						className="relative w-[500px] rounded-2xl shadow-xl ring-1 ring-gray-900/10"
					/>
				</m.div>
			</BlurOnScroll>
		</section>
	);
}
