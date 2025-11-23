"use client";
import { motion, AnimatePresence, useMotionValue, Variants, animate } from "motion/react";
import { Home, Info, Grid3x3, Code2, Briefcase, Mail, Menu, X } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@/utils/functions";

export interface NavItem {
	id: string;
	label: string;
	icon: React.ElementType;
	href: string;
}

export interface FloatingSidebarProps {
	onItemClick?: (item: NavItem) => void;
	defaultOpen?: boolean;
	className?: string;
	items?: NavItem[];
}

const defaultNavItems: NavItem[] = [
	{ id: "home", label: "Home", icon: Home, href: "#home" },
	{ id: "about", label: "About Me", icon: Info, href: "#about" },
	{ id: "technologies", label: "Technologies", icon: Grid3x3, href: "#tech" },
	{ id: "projects", label: "Projects", icon: Code2, href: "#projects" },
	{ id: "experience", label: "Prof. Experience", icon: Briefcase, href: "#experience" },
	{ id: "contact", label: "Contact Me", icon: Mail, href: "#contact" },
];

export function FloatingSidebar({ items = defaultNavItems, defaultOpen = false, className, onItemClick }: FloatingSidebarProps) {
	const [isOpen, setIsOpen] = useState(defaultOpen);
	const [activeItem, setActiveItem] = useState(items[0]?.id);
	const [hoveredItem, setHoveredItem] = useState<string | null>(null);
	const [toggleSide, setToggleSide] = useState<"left" | "right">("left");

	const [isDragging, setIsDragging] = useState(false);
	const dragStartX = useRef(0);
	const dragStartY = useRef(0);
	const dragStartPosition = useRef<"left" | "right">("left");

	const dragX = useMotionValue(24);
	const dragY = useMotionValue(24);

	useEffect(() => {
		const handleScroll = () => {
			const sections = items.map(({ id, href }) => ({ id, element: document.querySelector(href) }));
			const scrollPosition = window.scrollY + window.innerHeight / 2;
			for (const { element, id } of sections) {
				if (element) {
					const { offsetTop, offsetHeight } = element as HTMLElement;
					if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
						setActiveItem(id);
						break;
					}
				}
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [items]);

	const handleItemClick = (item: NavItem) => {
		setActiveItem(item.id);
		onItemClick?.(item);

		const element = document.querySelector(item.href);
		if (element) {
			const offsetTop = (element as HTMLElement).offsetTop;
			window.scrollTo({
				top: offsetTop - 100,
				behavior: "smooth",
			});
		}
	};

	const handleDragStart = useCallback(
		(event: any, info: any) => {
			setIsDragging(false);
			dragStartX.current = info.point.x;
			dragStartY.current = info.point.y;
			dragStartPosition.current = toggleSide;
		},
		[toggleSide]
	);

	const handleDrag = useCallback((event: any, info: any) => {
		const deltaX = Math.abs(info.point.x - dragStartX.current);
		const deltaY = Math.abs(info.point.y - dragStartY.current);
		if (deltaX > 5 || deltaY > 5) setIsDragging(true);
	}, []);

	const handleDragEnd = useCallback(
		(event: any, info: any) => {
			const windowWidth = typeof window !== "undefined" ? window.innerWidth : 800;
			const windowHeight = typeof window !== "undefined" ? window.innerHeight : 800;

			let newSide: "left" | "right";

			const dragDeltaX = info.point.x - dragStartX.current;
			const dragDeltaY = Math.abs(info.point.y - dragStartY.current);

			// Only change sides if horizontal movement is significant AND greater than vertical movement
			if (Math.abs(dragDeltaX) > 50 && Math.abs(dragDeltaX) > dragDeltaY) {
				newSide = dragDeltaX > 0 ? "right" : "left";
			} else {
				// Stay on the current side
				newSide = toggleSide;
			}

			setToggleSide(newSide);

			const targetX = newSide === "right" ? windowWidth - 80 : 24;
			const clampedY = Math.max(24, Math.min(info.point.y, windowHeight - 80));

			// Animate with bouncy spring effect
			animate(dragX, targetX, {
				type: "spring",
				stiffness: 300,
				damping: 15,
				mass: 0.8,
			});

			animate(dragY, clampedY, {
				type: "spring",
				stiffness: 300,
				damping: 15,
				mass: 0.8,
			});
		},
		[dragX, dragY, toggleSide]
	);

	const handleToggleClick = useCallback(() => {
		if (!isDragging) {
			setIsOpen(!isOpen);
		}
		setTimeout(() => setIsDragging(false), 100);
	}, [isDragging, isOpen]);

	const sidebarVariants: Variants = {
		open: {
			x: 0,
			opacity: 1,
			scale: 1,
			transition: {
				type: "spring",
				stiffness: 400,
				damping: 40,
				mass: 0.8,
				staggerChildren: 0.05,
				delayChildren: 0.05,
			},
		},
		closed: {
			x: toggleSide === "left" ? -250 : 250,
			opacity: 0,
			scale: 0.95,
			transition: {
				type: "spring",
				stiffness: 400,
				damping: 40,
				mass: 0.8,
				staggerChildren: 0.03,
				staggerDirection: -1,
			},
		},
	};

	const itemVariants: Variants = {
		open: {
			x: 0,
			opacity: 1,
			scale: 1,
			transition: {
				type: "spring",
				stiffness: 500,
				damping: 35,
				mass: 0.5,
			},
		},
		closed: {
			x: toggleSide === "left" ? -30 : 30,
			opacity: 0,
			scale: 0.8,
			transition: {
				type: "spring",
				stiffness: 500,
				damping: 35,
			},
		},
	};

	const positionClasses = toggleSide === "left" ? "left-6" : "right-6";

	return (
		<>
			<motion.button
				drag
				dragElastic={0}
				dragMomentum={false}
				dragTransition={{ power: 0, timeConstant: 0, modifyTarget: undefined }}
				dragConstraints={{
					bottom: typeof window !== "undefined" ? window.innerHeight - 80 : 800,
					right: typeof window !== "undefined" ? window.innerWidth - 80 : 800,
					left: 0,
					top: 0,
				}}
				onDragStart={handleDragStart}
				onDrag={handleDrag}
				onDragEnd={handleDragEnd}
				style={{ x: dragX, y: dragY, willChange: "transform" }}
				initial={{ x: 24, y: 24, scale: 0 }}
				animate={{ scale: 1, transition: { type: "spring", stiffness: 400, damping: 25, mass: 0.5 } }}
				whileHover={{ scale: 1.15, transition: { type: "spring", stiffness: 500, damping: 20, mass: 0.5 } }}
				whileTap={{ scale: 0.95 }}
				whileDrag={{ scale: 1.1, cursor: "grabbing", transition: { duration: 0 } }}
				onClick={handleToggleClick}
				className={cn(
					"fixed z-[100] rounded-full p-3 mt-10 shadow-2xl backdrop-blur-sm transition-colors duration-300 cursor-grab active:cursor-grabbing",
					"bg-gradient-to-br from-black to-gray-900 border border-gray-800/50",
					"hover:border-blue-500/30 hover:shadow-blue-500/20 hover:shadow-xl",
					"hidden md:flex items-center justify-center",
					!isOpen && "bg-black/90"
				)}>
				<AnimatePresence mode="wait">
					{isOpen ? (
						<motion.div
							key="close"
							exit={{ rotate: 180, opacity: 0 }}
							animate={{ rotate: 0, opacity: 1 }}
							initial={{ rotate: -180, opacity: 0 }}
							transition={{ type: "spring", stiffness: 300, damping: 20 }}>
							<X className="h-5 w-5 text-white" />
						</motion.div>
					) : (
						<motion.div
							key="menu"
							exit={{ rotate: -180, opacity: 0 }}
							animate={{ rotate: 0, opacity: 1 }}
							initial={{ rotate: 180, opacity: 0 }}
							transition={{ type: "spring", stiffness: 300, damping: 20 }}>
							<Menu className="h-5 w-5 text-white" />
						</motion.div>
					)}
				</AnimatePresence>
			</motion.button>

			<AnimatePresence>
				{isOpen && (
					<motion.nav
						variants={sidebarVariants}
						initial="closed"
						animate="open"
						exit="closed"
						className={cn(
							"fixed top-20 z-50 flex flex-col gap-1 rounded-2xl border border-gray-800/50 bg-black/95 p-2 shadow-2xl backdrop-blur-md",
							positionClasses,
							className
						)}>
						{items.map((item) => {
							const Icon = item.icon;
							const isActive = activeItem === item.id;
							const isHovered = hoveredItem === item.id;

							return (
								<motion.button
									key={item.id}
									variants={itemVariants}
									onClick={() => handleItemClick(item)}
									onMouseEnter={() => setHoveredItem(item.id)}
									onMouseLeave={() => setHoveredItem(null)}
									whileHover={{
										scale: 1.05,
										transition: { type: "spring", stiffness: 400, damping: 20 },
									}}
									whileTap={{
										scale: 0.95,
										transition: { type: "spring", stiffness: 400, damping: 20 },
									}}
									className={cn(
										"relative flex flex-col items-center gap-1.5 rounded-xl px-5 py-3 text-xs font-medium transition-all duration-300",
										"hover:bg-gray-900/50",
										isActive && "bg-gray-900/80"
									)}>
									{isActive && (
										<motion.div
											layoutId="activeIndicator"
											className="absolute inset-0 rounded-xl border-2 border-blue-500 shadow-lg shadow-blue-500/30"
											initial={false}
											transition={{
												type: "spring",
												stiffness: 500,
												damping: 35,
												mass: 0.5,
											}}
										/>
									)}

									<motion.div
										animate={{ scale: isActive || isHovered ? 1.15 : 1, rotate: isHovered ? [0, -8, 8, -8, 0] : 0 }}
										transition={{ rotate: { duration: 0.6, ease: "easeInOut" }, scale: { type: "spring", stiffness: 500, damping: 25 } }}>
										<Icon
											className={cn(
												"h-5 w-5 transition-all duration-300",
												isActive || isHovered ? "text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" : "text-gray-400"
											)}
										/>
									</motion.div>

									<motion.span
										className={cn(
											"relative z-10 text-center transition-colors duration-300",
											isActive || isHovered ? "text-white" : "text-gray-400"
										)}
										animate={{ y: isHovered ? -2 : 0 }}
										transition={{ type: "spring", stiffness: 400, damping: 20 }}>
										{item.label}
									</motion.span>

									{(isActive || isHovered) && (
										<motion.div
											initial={{ opacity: 0, scale: 0.8 }}
											animate={{ opacity: 1, scale: 1 }}
											exit={{ opacity: 0, scale: 0.8 }}
											transition={{
												type: "spring",
												stiffness: 300,
												damping: 20,
											}}
											className="absolute inset-0 rounded-xl bg-blue-500/10 blur-xl"
										/>
									)}
								</motion.button>
							);
						})}

						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 20 }}
							className="mt-2 flex justify-center gap-1 px-5 pb-1">
							{[0, 1, 2].map((i) => (
								<motion.div
									key={i}
									animate={{
										scale: [1, 1.4, 1],
										opacity: [0.3, 0.8, 0.3],
									}}
									transition={{
										duration: 2.5,
										repeat: Infinity,
										delay: i * 0.3,
										ease: "easeInOut",
									}}
									className="h-1 w-1 rounded-full bg-blue-400 shadow-lg shadow-blue-400/50"
								/>
							))}
						</motion.div>
					</motion.nav>
				)}
			</AnimatePresence>
		</>
	);
}
