import { twMerge } from "tailwind-merge";

interface CardProps {
	type: "Artist" | "Album" | "Track" | "Playlist" | "User";
	header: string;
	image: string;
}

export default function Card(props: CardProps) {
	return (
		<div
			className="w-48 h-64 p-4 flex flex-col justify-between gap-2 select-none
					rounded-md hover:bg-slate-800 transition-colors duration-150"
		>
			<img
				className={twMerge(
					"rounded-md shadow-lg max-w-48 max-h-48",
					props.type === "Artist" ? "rounded-full" : ""
				)}
				src={props.image}
				alt={`${props.header} image`}
			/>
			<div>
				<h2 className="text-base font-medium hover:underline truncate">
					{props.header}
				</h2>
				<p className="text-slate-400 font-light text-sm">{props.type}</p>
			</div>
		</div>
	);
}
