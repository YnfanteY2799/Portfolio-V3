"use client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown";
import MoonStarIcon from "@/components/svg/animateds/icons/MoonStars";
import useHasBeenMounted from "@/utils/hooks/useHasBeenMounted.ts";
import { type ReactNode, type MouseEvent, useRef, useCallback } from "react";
import SunIcon from "@/components/svg/animateds/icons/Sun";
import { AnimatePresence, m } from "motion/react";
import useToggle from "@/utils/hooks/useToggle";
import Button from "@/components/ui/Button";
import { useTheme } from "next-themes";
import { flushSync } from "react-dom";

/**
 * ThemeToggleM - An animated theme toggle component with dropdown menu
 *
 * @description
 * This component provides an interactive button that displays the current theme
 * ( light or dark ) with animated icons. When clicked, it opens a dropdown
 * menu that allows users to select between the three theme options.
 *
 * The component handles all theme state internally by leveraging the next-themes
 * library and responds to hover states with additional animations. Each theme option
 * has its own unique animation set that appears when hovered.
 *
 * @example
 * // Basic usage in a navigation bar
 * <nav>
 *   <div className="flex items-center justify-between">
 *     <Logo />
 *     <ThemeToggleM />
 *   </div>
 * </nav>
 *
 * @returns {ReactNode} A button that toggles between light, dark, and system themes with animations
 */
export default function ThemeSelector(): ReactNode {
	// Ref
	const buttonRef = useRef<HTMLButtonElement | null>(null);

	/**
	 * Tracks whether the component has mounted to avoid hydration mismatches
	 * since theme detection requires client-side code
	 */
	const hasBeenMounted = useHasBeenMounted();

	/** Theme context from next-themes providing the current theme and setter function */
	const { setTheme, theme } = useTheme();

	/** Controls the open/closed state of the dropdown menu */
	const { value, toggle } = useToggle();

	const changeTheme = useCallback(async function ({ currentTarget: { id } }: MouseEvent): Promise<void> {
		if (!buttonRef.current || id === theme) return;

		await document.startViewTransition(() => flushSync(() => setTheme(() => id))).ready;

		const { top, left, width, height } = buttonRef.current.getBoundingClientRect();
		const y = top + height / 2;
		const x = left + width / 2;

		const right = window.innerWidth - left;
		const bottom = window.innerHeight - top;
		const maxRad = Math.hypot(Math.max(left, right), Math.max(top, bottom));

		document.documentElement.animate(
			{ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${maxRad}px at ${x}px ${y}px)`] },
			{ duration: 700, easing: "ease-in-out", pseudoElement: "::view-transition-new(root)" }
		);
	}, [value]);

	return hasBeenMounted ? (
		<DropdownMenu open={value} onOpenChange={toggle}>
			<DropdownMenuTrigger asChild>
				<Button
					size="icon"
					ref={buttonRef}
					variant="outline"
					aria-label="Toggle theme"
					className="relative overflow-hidden hover:cursor-pointer">
					<div className="relative flex items-center justify-center w-full h-full">
						<AnimatePresence>
							<m.div
								key="sun"
								animate={{ opacity: 1, rotate: 0, scale: 1 }}
								exit={{ opacity: 0, rotate: 30, scale: 0.2 }}
								initial={{ opacity: 0, rotate: -30, scale: 0.2 }}
								className="absolute inset-0 flex items-center justify-center"
								transition={{ duration: 0.5, type: "spring", stiffness: 200 }}>
								{theme === "light" && <SunIcon animateOnHover animateOnView animation="path" />}
								{theme === "dark" && <MoonStarIcon animateOnHover animateOnView animation="path" />}
							</m.div>
						</AnimatePresence>
					</div>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="min-w-[8rem] overflow-hidden z-[80]">
				<DropdownMenuItem id="light" onClick={changeTheme} className="flex items-center gap-2 cursor-pointer" asChild>
					<m.div whileHover={{ x: 2 }} whileTap={{ scale: 0.98 }}>
						<SunIcon animateOnHover animation="path" />
						<span>Light</span>
					</m.div>
				</DropdownMenuItem>

				<DropdownMenuItem id="dark" onClick={changeTheme} className="flex items-center gap-2 cursor-pointer" asChild>
					<m.div whileHover={{ x: 2 }} whileTap={{ scale: 0.98 }}>
						<MoonStarIcon animateOnHover animation="path" />
						<span>Dark</span>
					</m.div>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	) : (
		<Button size="icon" variant="outline" aria-label="Toggle theme" className="relative overflow-hidden">
			<div className="relative flex items-center justify-center w-full h-full" />
		</Button>
	);
}
