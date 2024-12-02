import { useRef } from "react";
import { twMerge } from "tailwind-merge";

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
			data-ignore-click
			className={twMerge(
				"w-full h-3 rounded-md bg-slate-500 overflow-clip group",
				className
			)}
			onClick={onClick}
			ref={progressRef}
		>
			<div
				className="h-full rounded-md bg-white transition-all duration-300 ease-out group-hover:bg-accent"
				style={{ width: `${Math.min(percentage, 1) * 100}%` }}
			></div>
		</div>
	);
}
