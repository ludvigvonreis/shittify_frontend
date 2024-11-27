import { animated, AnimationProps, SpringValue } from "@react-spring/web";
import { twMerge } from "tailwind-merge";

interface IconProps extends AnimationProps {
	className?: string;
	title?: string;
	onClick?: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
	style?: React.CSSProperties | Record<string, SpringValue<any>>;
}

interface MaterialIconProps extends IconProps {
	type: string;
}

interface SvgIconProps extends IconProps {
	path: string | SpringValue<string>;
	viewBox: string;
}

export default function Icon(props: MaterialIconProps) {
	return (
		<animated.span
			data-ignore-click
			title={props.title}
			className={twMerge(
				"material-symbols-outlined inline align-bottom select-none",
				props.className
			)}
			onClick={props.onClick}
			style={props.style}
		>
			{props.type}
		</animated.span>
	);
}

Icon.SVG = function (props: SvgIconProps) {
	return (
		<span title={props.title} onClick={props.onClick}>
			<animated.svg
				className={twMerge("select-none", props.className)}
				xmlns="http://www.w3.org/2000/svg"
				viewBox={props.viewBox}
				style={props.style}
			>
				<animated.path d={props.path}/>
			</animated.svg>
		</span>
	);
};
