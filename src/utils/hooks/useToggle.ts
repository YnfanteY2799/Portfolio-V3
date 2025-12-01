import { useCallback, useState } from "react";
import type { ReturnUseToggleHook } from "@/types/hooks";

/**
 * A custom React hook that provides boolean toggle functionality with utility methods.
 *
 * The `useToggle` hook creates a boolean state and returns the state value along with
 * functions to manipulate it. This hook is designed for common UI interactions like
 * showing/hiding elements, enabling/disabling features, or toggling between two states.
 *
 * @param {boolean} [defaultValue=false] - The initial state value. Defaults to false if not provided.
 *
 * @returns {Object} An object containing the current boolean value and utility functions
 * @returns {boolean} value - The current boolean state
 * @returns {Function} toggle - Function to toggle the boolean value (true → false, false → true)
 * @returns {Function} setTrue - Function to set the value to true regardless of current state
 * @returns {Function} setFalse - Function to set the value to false regardless of current state
 *
 * @example
 * // Basic usage
 * function Collapsible() {
 *   const { value: isOpen, toggle, setTrue, setFalse } = useToggle(false);
 *
 *   return (
 *     <div>
 *       <button onClick={toggle}>
 *         {isOpen ? 'Hide Details' : 'Show Details'}
 *       </button>
 *
 *       {isOpen && (
 *         <div className="content">
 *           <p>Additional content here...</p>
 *           <button onClick={setFalse}>Close</button>
 *         </div>
 *       )}
 *     </div>
 *   );
 * }
 *
 * @example
 * // Using with multiple elements
 * function SettingsPanel() {
 *   const darkMode = useToggle(true);
 *   const notifications = useToggle(true);
 *
 *   return (
 *     <div className="settings">
 *       <div className="setting">
 *         <span>Dark Mode</span>
 *         <button onClick={darkMode.toggle}>
 *           {darkMode.value ? 'ON' : 'OFF'}
 *         </button>
 *       </div>
 *
 *       <div className="setting">
 *         <span>Notifications</span>
 *         <button onClick={notifications.toggle}>
 *           {notifications.value ? 'ON' : 'OFF'}
 *         </button>
 *       </div>
 *     </div>
 *   );
 * }
 *
 * @example
 * // Common use cases
 * // - Show/hide modal dialogs
 * // - Toggle dropdown menus
 * // - Enable/disable form fields
 * // - Switch between edit and view modes
 * // - Control accordion panels
 * // - Implement tabs or collapsible sections
 */
export default function useToggle(defaultValue: boolean = false): ReturnUseToggleHook {
	/**
	 * The internal state that holds the boolean value.
	 * Initialized with the defaultValue parameter, which defaults to false if not provided.
	 */
	const [value, setValue] = useState(defaultValue);

	return {
		// The current boolean state
		value,

		// Toggle function flips the current value using the functional form of setState
		// for guaranteed accuracy when the new state depends on the previous state
		toggle: useCallback(() => setValue((v) => !v), []),

		// Explicitly set to true regardless of current state
		setTrue: useCallback(() => setValue(true), []),

		// Explicitly set to false regardless of current state
		setFalse: useCallback(() => setValue(false), []),
	};
}
