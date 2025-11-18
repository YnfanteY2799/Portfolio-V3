import { cva, type VariantProps } from "class-variance-authority";

export const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
	{
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
				destructive:
					"bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
				outline:
					"border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
				secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
				ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
				link: "text-primary underline-offset-4 hover:underline",
				soft: "bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30",
				gradient: "bg-gradient-to-r from-primary to-primary-accent text-primary-foreground shadow-xs hover:opacity-90",
				subtle: "border border-border/40 bg-transparent hover:border-border hover:bg-accent/40",
				success: "bg-success text-success-foreground hover:bg-success/90 focus-visible:ring-success/20",
				warning: "bg-warning text-warning-foreground hover:bg-warning/90 focus-visible:ring-warning/20",
				muted: "bg-muted text-muted-foreground hover:bg-muted/80",
			},
			size: {
				default: "h-9 px-4 py-2 has-[>svg]:px-3",
				sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
				lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
				xl: "h-12 rounded-md px-8 text-base has-[>svg]:px-6",
				icon: "size-9",
				"icon-sm": "size-8",
				"icon-lg": "size-10",
				xs: "h-7 rounded text-xs px-2.5 py-1 has-[>svg]:px-2",
			},
			rounded: {
				pill: "rounded-[999px]",
				default: "rounded-md",
				full: "rounded-full",
				none: "rounded-none",
				lg: "rounded-lg",
				sm: "rounded",
			},
			isLoading: { true: "relative !text-transparent transition-none hover:!text-transparent [&>*:not(.loading-spinner)]:invisible" },
			fullWidth: { true: "w-full" },
		},
		defaultVariants: {
			size: "default",
			variant: "default",
			rounded: "default",
			fullWidth: undefined,
			isLoading: undefined,
		},
	}
);

/**
 * Type definition for button variants
 * Useful for creating components that extend button functionality
 */
export type ButtonVariantProps = VariantProps<typeof buttonVariants>;

/**
 * Legacy type name for backward compatibility
 * @deprecated Use ButtonVariantProps instead
 */
export type btnVariants = typeof buttonVariants;
