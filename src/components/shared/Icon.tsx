import { animated, AnimationProps, SpringValue } from "@react-spring/web";
import { CSSProperties } from "react";
import { twMerge } from "tailwind-merge";

interface IconProps extends AnimationProps {
	type: string;
	className?: string;
	title?: string;
	onClick?: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
	style?: React.CSSProperties | Record<string, SpringValue<any>>;
}

export default function Icon(props: IconProps) {
	return (
		<animated.span
			data-ignore-click
			title={props.title}
			className={twMerge("material-symbols-outlined inline align-bottom select-none", props.className)}
			onClick={props.onClick}
			style={props.style}
		>
			{props.type}
		</animated.span>
	);
}
