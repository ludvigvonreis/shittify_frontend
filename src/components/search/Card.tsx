import React from "react";
import { twMerge } from "tailwind-merge";

interface CardProps {
	type: "Artist" | "Album" | "Track" | "Playlist" | "User";
	subHeader: React.ReactNode;
	header: React.ReactNode;
	image: string;
	onDoubleClick?: () => void;
	className?: string;
}

export default function Card(props: CardProps) {
	return (
		<div
			className={twMerge(
				props.className,
				`w-48 h-full p-4 flex flex-col gap-2 select-none
					rounded-md hover:bg-slate-800 transition-colors duration-150`
			)}
			onDoubleClick={props.onDoubleClick}
		>
			<img
				className={twMerge(
					"rounded-md shadow-lg max-w-48 max-h-48 aspect-square text-center object-cover",
					props.type === "Artist" ? "rounded-full" : ""
				)}
				src={props.image}
				alt={`${props.type} image`}
			/>
			<div>
				<h2 className="text-base font-medium hover:underline truncate">
					{props.header}
				</h2>
				<p className="text-slate-400 font-light text-sm">
					{props.subHeader}
				</p>
			</div>
		</div>
	);
}
