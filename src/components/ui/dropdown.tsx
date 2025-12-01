"use client";
import { CaretRightIcon, CheckIcon, CircleIcon } from "@phosphor-icons/react/dist/ssr";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "@/utils/functions";

import type { ComponentProps, ReactNode } from "react";

/**
 * Props for the DropdownMenu component.
 * @see {@link DropdownMenuPrimitive.Root} for more details on available properties.
 */
export type DropdownMenuProps = ComponentProps<typeof DropdownMenuPrimitive.Root>;

/**
 * Props for the DropdownMenuPortal component.
 * @see {@link DropdownMenuPrimitive.Portal} for more details on available properties.
 */
export type DropdownMenuPortalProps = ComponentProps<typeof DropdownMenuPrimitive.Portal>;

/**
 * Props for the DropdownMenuTrigger component.
 * @see {@link DropdownMenuPrimitive.Trigger} for more details on available properties.
 */
export type DropdownMenuTriggerProps = ComponentProps<typeof DropdownMenuPrimitive.Trigger>;

/**
 * Props for the DropdownMenuContent component.
 * @see {@link DropdownMenuPrimitive.Content} for more details on available properties.
 */
export type DropdownMenuContentProps = ComponentProps<typeof DropdownMenuPrimitive.Content>;

/**
 * Props for the DropdownMenuGroup component.
 * @see {@link DropdownMenuPrimitive.Group} for more details on available properties.
 */
export type DropdownMenuGroupProps = ComponentProps<typeof DropdownMenuPrimitive.Group>;

/**
 * Dropdown Item Common Props - extends standard item props with additional styling options.
 * @property {boolean} [inset=false] - When true, adds padding to the left for alignment with checkbox and radio items
 * @property {('default'|'destructive')} [variant='default'] - Visual style variant of the item
 */
export type DICP = { inset?: boolean; variant?: "default" | "destructive" };

/**
 * Props for the DropdownMenuItem component.
 * @see {@link DropdownMenuPrimitive.Item} for more details on available properties.
 */
export type DropdownMenuItemProps = ComponentProps<typeof DropdownMenuPrimitive.Item>;

/**
 * Props for the DropdownMenuCheckboxItem component.
 * @see {@link DropdownMenuPrimitive.CheckboxItem} for more details on available properties.
 */
export type DropdownMenuCheckboxItemProps = ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>;

/**
 * Props for the DropdownMenuRadioGroup component.
 * @see {@link DropdownMenuPrimitive.RadioGroup} for more details on available properties.
 */
export type DropdownMenuRadioGroupProps = ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>;

/**
 * Props for the DropdownMenuRadioItem component.
 * @see {@link DropdownMenuPrimitive.RadioItem} for more details on available properties.
 */
export type DropdownMenuRadioItemProps = ComponentProps<typeof DropdownMenuPrimitive.RadioItem>;

/**
 * Props for the DropdownMenuLabel component.
 * @see {@link DropdownMenuPrimitive.Label} for more details on available properties.
 */
export type DropdownMenuLabelProps = ComponentProps<typeof DropdownMenuPrimitive.Label>;

/**
 * Props for the DropdownMenuSeparator component.
 * @see {@link DropdownMenuPrimitive.Separator} for more details on available properties.
 */
export type DropdownMenuSeparatorProps = ComponentProps<typeof DropdownMenuPrimitive.Separator>;

/**
 * Props for the DropdownMenuSub component.
 * @see {@link DropdownMenuPrimitive.Sub} for more details on available properties.
 */
export type DropdownMenuSubProps = ComponentProps<typeof DropdownMenuPrimitive.Sub>;

/**
 * Props for the DropdownMenuSubTrigger component.
 * @see {@link DropdownMenuPrimitive.SubTrigger} for more details on available properties.
 */
export type DropdownMenuSubTriggerProps = ComponentProps<typeof DropdownMenuPrimitive.SubTrigger>;

/**
 * Props for the DropdownMenuSubContent component.
 * @see {@link DropdownMenuPrimitive.SubContent} for more details on available properties.
 */
export type DropdownMenuSubContentProps = ComponentProps<typeof DropdownMenuPrimitive.SubContent>;

/**
 * Root component for the dropdown menu.
 * Manages the state and context for the entire dropdown menu.
 *
 * @example
 * ```tsx
 * <DropdownMenu>
 *   <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
 *   <DropdownMenuContent>
 *     <DropdownMenuItem>Item 1</DropdownMenuItem>
 *     <DropdownMenuItem>Item 2</DropdownMenuItem>
 *   </DropdownMenuContent>
 * </DropdownMenu>
 * ```
 *
 * @param {DropdownMenuProps} props - Props for the dropdown menu
 * @returns {ReactNode} Rendered dropdown menu root component
 */
export function DropdownMenu(props: DropdownMenuProps): ReactNode {
	return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

/**
 * Portal component for the dropdown menu.
 * Renders dropdown menu content in a portal to avoid clipping issues.
 *
 * @param {DropdownMenuPortalProps} props - Props for the dropdown menu portal
 * @returns {ReactNode} Rendered portal component
 */
export function DropdownMenuPortal(props: DropdownMenuPortalProps): ReactNode {
	return <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />;
}

/**
 * Trigger component for the dropdown menu.
 * The interactive element that toggles the dropdown menu.
 *
 * @param {DropdownMenuTriggerProps} props - Props for the dropdown menu trigger
 * @returns {ReactNode} Rendered trigger component
 */
export function DropdownMenuTrigger(props: DropdownMenuTriggerProps): ReactNode {
	return <DropdownMenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />;
}

/**
 * Content component for the dropdown menu.
 * Contains all the menu items and provides styling and animations.
 *
 * @param {DropdownMenuContentProps} props - Props for the dropdown menu content
 * @param {string} [props.className] - Additional CSS classes
 * @param {number} [props.sideOffset=4] - Offset from the trigger element
 * @returns {ReactNode} Rendered content component inside a portal
 */
export function DropdownMenuContent({ className, sideOffset = 4, ...props }: DropdownMenuContentProps): ReactNode {
	return (
		<DropdownMenuPrimitive.Portal>
			<DropdownMenuPrimitive.Content
				data-slot="dropdown-menu-content"
				sideOffset={sideOffset}
				className={cn(
					"bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md",
					className
				)}
				{...props}
			/>
		</DropdownMenuPrimitive.Portal>
	);
}

/**
 * Group component for the dropdown menu.
 * Groups related menu items together.
 *
 * @param {DropdownMenuGroupProps} props - Props for the dropdown menu group
 * @returns {ReactNode} Rendered group component
 */
export function DropdownMenuGroup(props: DropdownMenuGroupProps): ReactNode {
	return <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />;
}

/**
 * Item component for the dropdown menu.
 * Represents a selectable menu item.
 *
 * @param {DropdownMenuItemProps & DICP} props - Props for the dropdown menu item
 * @param {string} [props.className] - Additional CSS classes
 * @param {boolean} [props.inset=false] - When true, adds padding to the left for alignment with checkbox and radio items
 * @param {('default'|'destructive')} [props.variant='default'] - Visual style variant of the item
 * @returns {ReactNode} Rendered item component
 */
export function DropdownMenuItem({ className, inset, variant = "default", ...props }: DropdownMenuItemProps & DICP): ReactNode {
	return (
		<DropdownMenuPrimitive.Item
			data-slot="dropdown-menu-item"
			data-inset={inset}
			data-variant={variant}
			className={cn(
				"focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
				className
			)}
			{...props}
		/>
	);
}

/**
 * Checkbox item component for the dropdown menu.
 * A menu item that can be checked/unchecked.
 *
 * @param {DropdownMenuCheckboxItemProps} props - Props for the dropdown menu checkbox item
 * @param {string} [props.className] - Additional CSS classes
 * @param {ReactNode} props.children - Content of the checkbox item
 * @param {boolean} [props.checked] - Whether the checkbox is checked
 * @returns {ReactNode} Rendered checkbox item component
 */
export function DropdownMenuCheckboxItem({ className, children, checked, ...props }: DropdownMenuCheckboxItemProps): ReactNode {
	return (
		<DropdownMenuPrimitive.CheckboxItem
			data-slot="dropdown-menu-checkbox-item"
			className={cn(
				"focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
				className
			)}
			checked={checked}
			{...props}>
			<span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
				<DropdownMenuPrimitive.ItemIndicator>
					<CheckIcon className="size-4" />
				</DropdownMenuPrimitive.ItemIndicator>
			</span>
			{children}
		</DropdownMenuPrimitive.CheckboxItem>
	);
}

/**
 * Radio group component for the dropdown menu.
 * Container for radio items that allows only one selection at a time.
 *
 * @param {DropdownMenuRadioGroupProps} props - Props for the dropdown menu radio group
 * @returns {ReactNode} Rendered radio group component
 */
export function DropdownMenuRadioGroup(props: DropdownMenuRadioGroupProps): ReactNode {
	return <DropdownMenuPrimitive.RadioGroup data-slot="dropdown-menu-radio-group" {...props} />;
}

/**
 * Radio item component for the dropdown menu.
 * A menu item that can be selected as part of a radio group.
 *
 * @param {DropdownMenuRadioItemProps} props - Props for the dropdown menu radio item
 * @param {string} [props.className] - Additional CSS classes
 * @param {ReactNode} props.children - Content of the radio item
 * @returns {ReactNode} Rendered radio item component
 */
export function DropdownMenuRadioItem({ className, children, ...props }: DropdownMenuRadioItemProps): ReactNode {
	return (
		<DropdownMenuPrimitive.RadioItem
			data-slot="dropdown-menu-radio-item"
			className={cn(
				"focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
				className
			)}
			{...props}>
			<span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
				<DropdownMenuPrimitive.ItemIndicator>
					<CircleIcon className="size-2 fill-current" />
				</DropdownMenuPrimitive.ItemIndicator>
			</span>
			{children}
		</DropdownMenuPrimitive.RadioItem>
	);
}

/**
 * Label component for the dropdown menu.
 * Provides a non-interactive label for grouping menu items.
 *
 * @param {DropdownMenuLabelProps & Omit<DICP, "variant">} props - Props for the dropdown menu label
 * @param {string} [props.className] - Additional CSS classes
 * @param {boolean} [props.inset=false] - When true, adds padding to the left for alignment with inset menu items
 * @returns {ReactNode} Rendered label component
 */
export function DropdownMenuLabel({ className, inset, ...props }: DropdownMenuLabelProps & Omit<DICP, "variant">): ReactNode {
	return (
		<DropdownMenuPrimitive.Label
			data-slot="dropdown-menu-label"
			data-inset={inset}
			className={cn("px-2 py-1.5 text-sm font-medium data-[inset]:pl-8", className)}
			{...props}
		/>
	);
}

/**
 * Separator component for the dropdown menu.
 * Visual divider to separate groups of menu items.
 *
 * @param {DropdownMenuSeparatorProps} props - Props for the dropdown menu separator
 * @returns {ReactNode} Rendered separator component
 */
export function DropdownMenuSeparator({ className, ...props }: DropdownMenuSeparatorProps): ReactNode {
	return (
		<DropdownMenuPrimitive.Separator data-slot="dropdown-menu-separator" className={cn("bg-border -mx-1 my-1 h-px", className)} {...props} />
	);
}

/**
 * Shortcut component for the dropdown menu.
 * Displays keyboard shortcut hints for menu items.
 *
 * @example
 * ```tsx
 * <DropdownMenuItem>
 *   Copy <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
 * </DropdownMenuItem>
 * ```
 *
 * @param {ComponentProps<"span">} props - Props for the shortcut span element
 * @returns {ReactNode} Rendered shortcut component
 */
export function DropdownMenuShortcut(props: ComponentProps<"span">): ReactNode {
	return (
		<span
			className={cn("text-muted-foreground ml-auto text-xs tracking-widest", props.className)}
			data-slot="dropdown-menu-shortcut"
			{...props}
		/>
	);
}

/**
 * Sub-menu component for the dropdown menu.
 * Creates a nested dropdown menu.
 *
 * @param {DropdownMenuSubProps} props - Props for the dropdown menu sub
 * @returns {ReactNode} Rendered sub-menu component
 */
export function DropdownMenuSub(props: DropdownMenuSubProps): ReactNode {
	return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />;
}

/**
 * Sub-menu trigger component for the dropdown menu.
 * The interactive element that toggles a sub-menu.
 *
 * @param {DropdownMenuSubTriggerProps & Omit<DICP, "variant">} props - Props for the dropdown menu sub trigger
 * @param {string} [props.className] - Additional CSS classes
 * @param {ReactNode} props.children - Content of the sub-menu trigger
 * @param {boolean} [props.inset=false] - When true, adds padding to the left for alignment
 * @returns {ReactNode} Rendered sub-menu trigger component
 */
export function DropdownMenuSubTrigger(props: DropdownMenuSubTriggerProps & Omit<DICP, "variant">): ReactNode {
	const { className, children, inset, ...cProps } = props;
	return (
		<DropdownMenuPrimitive.SubTrigger
			data-slot="dropdown-menu-sub-trigger"
			data-inset={inset}
			className={cn(
				"focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8",
				className
			)}
			{...cProps}>
			{children}
			<CaretRightIcon className="ml-auto size-4" />
		</DropdownMenuPrimitive.SubTrigger>
	);
}

/**
 * Sub-menu content component for the dropdown menu.
 * Contains menu items for a sub-menu.
 *
 * @param {DropdownMenuSubContentProps} props - Props for the dropdown menu sub content
 * @returns {ReactNode} Rendered sub-menu content component
 */
export function DropdownMenuSubContent({ className, ...props }: DropdownMenuSubContentProps): ReactNode {
	return (
		<DropdownMenuPrimitive.SubContent
			data-slot="dropdown-menu-sub-content"
			className={cn(
				"bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg",
				className
			)}
			{...props}
		/>
	);
}
