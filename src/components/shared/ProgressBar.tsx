import { useRef, useState } from "react";
import { twMerge } from 'tailwind-merge'

interface ProgressBarProps {
	percentage?: number;
	onChangeProgress?: (newPercentage: number) => void;
	className?: string;
}

export default function ProgressBar({
	percentage = 0,
	onChangeProgress,
	className,
}: ProgressBarProps) {
	const progressRef = useRef<HTMLDivElement>(null);

	function onClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
		if (progressRef.current == undefined) return;

		const clickX = event.clientX;
		const { left: progressX, width: totalWidth } =
			progressRef.current.getBoundingClientRect();

		const relativeX = clickX - progressX;
		const percentage = relativeX / totalWidth;

		if (onChangeProgress) onChangeProgress(percentage);
	}

	return (
		<div
			className={twMerge("w-full h-3 rounded-md bg-slate-500", className)}
			onClick={onClick}
			ref={progressRef}
		>
			<div
				className="h-full rounded-md bg-white"
				style={{
					width: `${Math.min(percentage, 1) * 100}%`,
				}}
			></div>
		</div>
	);
}
