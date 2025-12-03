"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { m as motion, type PanInfo, useMotionValue, useTransform, Variants } from "framer-motion";
import { cn } from "@/utils/functions";

type SizeVariant = "default" | "large" | "xl" | "2xl" | "3xl" | "4xl";
type BackdropVariant = "opaque" | "blur" | "transparent";
type PositionVariant = "center" | "top" | "bottom";

/**
 * Custom hook to handle drag-to-dismiss and drag-to-fullscreen gestures
 */
const useDragToClose = (
	enabled: boolean,
	dismissable: boolean,
	isFullscreen: boolean,
	setIsFullscreen: (value: boolean) => void,
	onClose: () => void
) => {
	const y = useMotionValue(0);
	const opacity = useTransform(y, [0, 300], [1, 0]);
	const [isDragging, setIsDragging] = React.useState(false);

	React.useEffect(() => {
		y.set(0);
	}, [y]);

	const handleDragEnd = React.useCallback(
		(_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
			if (!enabled) return;

			setIsDragging(false);
			const threshold = 150;

			if (info.offset.y > threshold) {
				if (isFullscreen) {
					setIsFullscreen(false);
					y.set(0);
				} else {
					if (dismissable) {
						onClose();
					} else {
						y.set(0);
					}
				}
			} else if (info.offset.y < -threshold && !isFullscreen) {
				setIsFullscreen(true);
				y.set(0);
			} else {
				y.set(0);
			}
		},
		[enabled, isFullscreen, dismissable, setIsFullscreen, onClose, y]
	);

	return {
		y,
		opacity,
		isDragging,
		setIsDragging,
		handleDragEnd,
	};
};

/**
 * Root component for the Interactive Modal
 */
const InteractiveModal = DialogPrimitive.Root;

const InteractiveModalTrigger = DialogPrimitive.Trigger;

interface InteractiveModalPortalProps extends DialogPrimitive.DialogPortalProps {
	backdrop?: BackdropVariant;
}

const InteractiveModalPortal = ({ backdrop = "opaque", ...props }: InteractiveModalPortalProps) => {
	return <DialogPrimitive.Portal {...props} />;
};

const InteractiveModalOverlay = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Overlay>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> & {
		backdrop?: BackdropVariant;
	}
>(({ className, backdrop = "opaque", ...props }, ref) => {
	const backdropStyles = {
		opaque: "bg-black/80",
		blur: "bg-black/20 backdrop-blur-sm [will-change:backdrop-filter]",
		transparent: "bg-transparent",
	};

	return (
		<DialogPrimitive.Overlay ref={ref} asChild {...props}>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.15, ease: "easeOut" }}
				className={cn("fixed inset-0 z-50", backdropStyles[backdrop], className)}
			/>
		</DialogPrimitive.Overlay>
	);
});
InteractiveModalOverlay.displayName = DialogPrimitive.Overlay.displayName;

interface InteractiveModalContentProps
	extends Omit<React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>, "onPointerDown" | "onPointerMove" | "onPointerUp"> {
	size?: SizeVariant;
	position?: PositionVariant;
	backdrop?: BackdropVariant;
	dismissable?: boolean;
	scrollable?: boolean;
	onOpenChange?: (open: boolean) => void;
}

const InteractiveModalContent = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Content>, InteractiveModalContentProps>(
	(
		{
			className,
			children,
			size = "default",
			position = "center",
			backdrop = "opaque",
			dismissable = true,
			scrollable = false,
			onOpenChange,
			...props
		},
		ref
	) => {
		const [isMobile, setIsMobile] = React.useState(false);
		const [isFullscreen, setIsFullscreen] = React.useState(false);

		const handleClose = React.useCallback(() => {
			onOpenChange?.(false);
		}, [onOpenChange]);

		const { y, opacity, isDragging, setIsDragging, handleDragEnd } = useDragToClose(
			isMobile,
			dismissable,
			isFullscreen,
			setIsFullscreen,
			handleClose
		);

		React.useEffect(() => {
			const checkMobile = () => {
				setIsMobile(window.innerWidth < 768);
			};
			checkMobile();
			window.addEventListener("resize", checkMobile);
			return () => window.removeEventListener("resize", checkMobile);
		}, []);

		React.useEffect(() => {
			if (!isMobile) return;

			const handleKeyDown = (e: KeyboardEvent) => {
				if (e.key === "f" || e.key === "F") {
					e.preventDefault();
					setIsFullscreen((prev) => !prev);
				}
			};

			window.addEventListener("keydown", handleKeyDown);
			return () => window.removeEventListener("keydown", handleKeyDown);
		}, [isMobile]);

		const sizeStyles = {
			default: "max-w-lg",
			large: "max-w-2xl",
			xl: "max-w-3xl",
			"2xl": "max-w-4xl",
			"3xl": "max-w-5xl",
			"4xl": "max-w-6xl",
		};

		const positionStyles = {
			center: "items-center",
			top: "items-start pt-12",
			bottom: "items-end pb-12",
		};

		const contentVariants: Variants = {
			hidden: {
				y: isMobile ? "100%" : 50,
				opacity: 0,
				scale: isMobile ? 1 : 0.95,
			},
			visible: {
				y: 0,
				opacity: 1,
				scale: 1,
				transition: {
					type: "spring",
					damping: 30,
					stiffness: 300,
					delay: 0.1,
				},
			},
			exit: {
				y: isMobile ? "100%" : 50,
				opacity: 0,
				scale: isMobile ? 1 : 0.95,
				transition: {
					type: "spring",
					damping: 30,
					stiffness: 300,
				},
			},
		};

		// Clone children and pass props directly instead of using context
		const enhancedChildren = React.Children.map(children, (child) => {
			if (React.isValidElement(child)) {
				// Pass props to specific components that need them
				if (child.type === InteractiveModalBody) {
					return React.cloneElement(child as React.ReactElement<any>, {
						isFullscreen,
						isMobile,
						scrollable,
					});
				}
			}
			return child;
		});

		return (
			<InteractiveModalPortal backdrop={backdrop}>
				<InteractiveModalOverlay backdrop={backdrop} />
				<div className={cn("fixed inset-0 z-50 flex justify-center", isMobile ? "items-end" : positionStyles[position])}>
					<DialogPrimitive.Content
						ref={ref}
						asChild
						onInteractOutside={(e) => {
							if (!dismissable) {
								e.preventDefault();
							}
						}}
						onEscapeKeyDown={(e) => {
							if (!dismissable) {
								e.preventDefault();
							}
						}}
						{...props}>
						<motion.div
							variants={contentVariants}
							initial="hidden"
							animate="visible"
							exit="exit"
							drag={isMobile ? "y" : false}
							dragConstraints={{ top: 0, bottom: 0 }}
							dragElastic={{ top: 0, bottom: 0.5 }}
							onDragStart={() => setIsDragging(true)}
							onDragEnd={handleDragEnd}
							style={isMobile ? { y, opacity: isDragging ? opacity : 1 } : {}}
							className={cn(
								"relative z-50 w-full bg-white shadow-lg",
								isMobile && !isFullscreen && "rounded-t-2xl",
								isMobile && isFullscreen && "h-full rounded-none",
								!isMobile && "rounded-lg border border-gray-200",
								!isMobile && sizeStyles[size],
								isMobile && !isFullscreen && "max-h-[85vh]",
								!isMobile && scrollable && "max-h-[90vh]",
								scrollable && "flex flex-col",
								className
							)}>
							{isMobile && (
								<div className="flex justify-center py-2 cursor-grab active:cursor-grabbing">
									<div className="w-12 h-1.5 bg-gray-300 rounded-full transition-colors hover:bg-gray-400" />
								</div>
							)}
							{enhancedChildren}
						</motion.div>
					</DialogPrimitive.Content>
				</div>
			</InteractiveModalPortal>
		);
	}
);
InteractiveModalContent.displayName = DialogPrimitive.Content.displayName;

const InteractiveModalHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
	<div className={cn("flex flex-col space-y-1.5 px-6 py-4 border-b border-gray-200", className)} {...props} />
);
InteractiveModalHeader.displayName = "InteractiveModalHeader";

interface InteractiveModalBodyProps extends React.HTMLAttributes<HTMLDivElement> {
	// These props are injected by the parent, but can also be passed manually
	isFullscreen?: boolean;
	isMobile?: boolean;
	scrollable?: boolean;
}

const InteractiveModalBody = ({ className, isFullscreen, isMobile, scrollable, ...props }: InteractiveModalBodyProps) => {
	return <div className={cn("px-6 py-4", scrollable && "overflow-y-auto", isMobile && isFullscreen && "flex-1", className)} {...props} />;
};
InteractiveModalBody.displayName = "InteractiveModalBody";

const InteractiveModalFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 px-6 py-4 border-t border-gray-200", className)}
		{...props}
	/>
);
InteractiveModalFooter.displayName = "InteractiveModalFooter";

const InteractiveModalTitle = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Title>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
	<DialogPrimitive.Title ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
));
InteractiveModalTitle.displayName = DialogPrimitive.Title.displayName;

const InteractiveModalDescription = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Description>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => <DialogPrimitive.Description ref={ref} className={cn("text-sm text-gray-600", className)} {...props} />);
InteractiveModalDescription.displayName = DialogPrimitive.Description.displayName;

const InteractiveModalClose = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Close>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>
>(({ className, ...props }, ref) => (
	<DialogPrimitive.Close
		ref={ref}
		className={cn(
			"absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:pointer-events-none",
			className
		)}
		asChild
		{...props}>
		<div>
			<X className="h-4 w-4" />
			<span className="sr-only">Close</span>
		</div>
	</DialogPrimitive.Close>
));
InteractiveModalClose.displayName = DialogPrimitive.Close.displayName;

export {
	InteractiveModal,
	InteractiveModalTrigger,
	InteractiveModalContent,
	InteractiveModalHeader,
	InteractiveModalBody,
	InteractiveModalFooter,
	InteractiveModalTitle,
	InteractiveModalDescription,
	InteractiveModalClose,
};
