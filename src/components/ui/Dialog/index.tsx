"use client";
import { Close, Description, Overlay, Portal, Root, Title, Trigger } from "@radix-ui/react-dialog";
import { cn } from "@/utils/functions";
import { motion } from "motion/react";

import type { ComponentProps, ComponentPropsWithRef, ReactNode } from "react";

type SizeVariant = "default" | "large" | "xl" | "2xl" | "3xl" | "4xl";
type BackdropVariant = "opaque" | "blur" | "transparent";
type PositionVariant = "center" | "top" | "bottom";

export interface IDialogPortalProps extends ComponentProps<typeof Portal> {
	backdrop: BackdropVariant;
}

export interface IDialogOverlayProps extends ComponentPropsWithRef<typeof Overlay> {
	backdrop: BackdropVariant;
}

export function Dialog({ ...props }: ComponentProps<typeof Root>): ReactNode {
	return <Root data-slot="dialog" {...props} />;
}

export function DialogTrigger({ ...props }: ComponentProps<typeof Trigger>): ReactNode {
	return <Trigger data-slot="dialog-trigger" {...props} />;
}

export function DialogPortal({ backdrop = "blur", ...props }: IDialogPortalProps): ReactNode {
	return <Portal data-slot="dialog-portal" {...props} />;
}

export function DialogClose({ ...props }: ComponentProps<typeof Close>): ReactNode {
	return <Close data-slot="dialog-close" {...props} />;
}

export function DialogOverlay({ ref, className, backdrop = "blur", ...props }: IDialogOverlayProps): ReactNode {
	const backdropStyles = {
		opaque: "bg-black/80",
		blur: "bg-black/20 backdrop-blur-sm [will-change:backdrop-filter]",
		transparent: "bg-transparent",
	};

	return (
		<Overlay ref={ref} data-slot="dialog-overlay" asChild {...props}>
			<motion.div
				exit={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				initial={{ opacity: 0 }}
				transition={{ duration: 0.15, ease: "easeOut" }}
				className={cn("fixed inset-0 z-50", backdropStyles[backdrop as keyof typeof backdropStyles], className)}
			/>
		</Overlay>
	);
}

export function DialogHeader({ className, ...props }: ComponentProps<"div">): ReactNode {
	return <div className={cn("flex flex-col space-y-1.5 px-6 py-4 border-b", className)} {...props} />;
}

export function DialogTitle({ className, ...props }: ComponentProps<typeof Title>): ReactNode {
	return <Title data-slot="dialog-title" className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />;
}

export function DialogDescription({ className, ...props }: ComponentProps<typeof Description>): ReactNode {
	return <Description className={cn("text-sm", className)} {...props} />;
}

export interface IDialogBodyProps extends ComponentProps<"div"> {
	isFullscreen?: boolean;
	scrollable?: boolean;
	isMobile?: boolean;
}

export function DialogBody({ scrollable, isMobile, isFullscreen, className, ...props }: IDialogBodyProps): ReactNode {
	return <div className={cn("px-6 py-4", scrollable && "overflow-y-auto", isMobile && isFullscreen && "flex-1", className)} {...props} />;
}

const positionStyles = {
	center: "items-center",
	top: "items-start pt-12",
	bottom: "items-end pb-12",
};
export interface IDialogContetProps {
	backdrop?: BackdropVariant;
}

export function DialogContent({ backdrop = "blur", ...props }: IDialogContetProps): ReactNode {
	return (
		<DialogPortal data-slot="dialog-portal" backdrop={backdrop}>
			<DialogOverlay backdrop={backdrop} />

			{/* <div className={cn("fixed inset-0 z-50 flex justify-center", isMobile ? "items-end" : positionStyles[position])}>



          
        </div> */}
		</DialogPortal>
	);
}

export function DialogFooter({ className, ...props }: ComponentProps<"div">): ReactNode {
	return <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 px-6 py-4 border-t", className)} {...props} />;
}
