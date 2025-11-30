"use client";
import CVDownloadModal from "@/components/modals/CVDownload";
import { cn } from "@/utils/functions";
import useScroll from "@/utils/hooks/useScroll";
import { domAnimation, LazyMotion, m, useReducedMotion } from "motion/react";
import Link from "next/link";
import { ReactNode, useMemo } from "react";

export default function Navbar(): ReactNode {
	// Hooks
	const { scrollStarted } = useScroll({ scrollThreshold: 5, useRaf: true });
	const prefersReducedMotion = useReducedMotion();

	// Classname
	const className = useMemo(
		() =>
			cn(
				"fixed top-0 left-0 right-0 z-[20] transition-all duration-200 will-change-transform",
				scrollStarted ? "bg-background/70 backdrop-blur-xl py-2 shadow-md" : "bg-transparent py-2 shadow-md"
			),
		[scrollStarted]
	);

	return (
		<LazyMotion features={domAnimation} strict>
			<m.header animate={{ y: 0 }} transition={{ duration: 0.5 }} initial={{ y: prefersReducedMotion ? 0 : -100 }} className={className}>
				<div className="container flex justify-between my-1 mx-4">
					<Link href="/Home" className="flex items-center space-x-2">
						<m.div
							whileTap={{ scale: 0.95, transition: { duration: 0.1 } }}
							whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
							transition={{ type: "spring", stiffness: 400, damping: 17 }}>
							LOG
						</m.div>
					</Link>
					<nav className="hidden md:flex items-center space-x-6">
						<div>X</div>
						<div>a</div>
						<div>n</div>
						<div>c</div>
					</nav>
					<div className="hidden md:flex items-center space-x-3">
						<CVDownloadModal />
					</div>
				</div>
			</m.header>
		</LazyMotion>
	);
}
