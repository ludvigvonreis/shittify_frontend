import { useEffect } from "react";

export function useDismissOnClickOutside<T extends HTMLElement>(
	ref: React.RefObject<T>,
	setIsActive: (value: boolean) => void
) {
	useEffect(() => {
		const handler = (e: MouseEvent) => {
			const target = e.target as HTMLElement;

			if (!target) return;

			// Ignore if clicking on this element
			if (ref.current && ref.current.contains(target as Node)) return;

			// Check if the click is on elements with the 'data-ignore-click' attribute
			if (target.closest("[data-ignore-click]")) {
				return; // Ignore clicks on these elements
			}

			// Deactivate otherwise
			setIsActive(false);
		};

		document.addEventListener("click", handler);

		return () => {
			document.removeEventListener("click", handler);
		};
	}, []);
}
