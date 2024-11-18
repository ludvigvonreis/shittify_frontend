import { twMerge } from "tailwind-merge";

interface IconProps {
	type: string;
	className?: string;
	onClick?: () => void;
}

export default function Icon(props: IconProps) {
	return (
		<span
			data-ignore-click
			className={twMerge("material-symbols-outlined inline align-bottom select-none", props.className)}
			onClick={props.onClick}
		>
			{props.type}
		</span>
	);
}
