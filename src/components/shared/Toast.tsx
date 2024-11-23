import { ToastMessageAtom } from "@atoms/atoms";
import { animated, useSpring } from "@react-spring/web";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";

export default function Toast() {
	const [toastMessage, setToastMessage] = useAtom(ToastMessageAtom);
	const [show, setShow] = useState(false);
	const [currentMessage, setCurrentMessage] = useState("");

	useEffect(() => {
		if (!toastMessage) return; // Ignore empty messages

		// Update the current message and show the toast
		setCurrentMessage(toastMessage);
		setShow(true);

		// Reset the timer
		const timer = setTimeout(() => {
			setShow(false); // Hide the toast after the duration
			setToastMessage("");
		}, 2000);

		// Cleanup timer on unmount or when `toastMessage` changes
		return () => clearTimeout(timer);
	}, [toastMessage]);

	return (
		<animated.div
			className="absolute bottom-full left-1/2 bg-slate-700
			p-3 flex items-center justify-center -translate-x-1/2 min-w-36 
			h-12 rounded-lg mb-5 text-center select-none transition-opacity duration-200"
			style={{ opacity: show ? 1 : 0 }}
			onClick={() => setShow(false)}
		>
			<h2 className="text-white">{currentMessage}</h2>
		</animated.div>
	);
}
