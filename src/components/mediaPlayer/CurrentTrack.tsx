import { useSpring, animated } from "@react-spring/web";

interface CurrentTrackProps {
	title: string;
	artist: string;
	converSrc: string;
}

export default function CurrentTrack(props: CurrentTrackProps) {
	const fadeIn = useSpring({
		from: { opacity: 0, transform: "translateX(20px)" },
		to: { opacity: 1, transform: "translateX(0px)" },
		reset: true,
		config: { tension: 200, friction: 20 },
	});


	return (
		<animated.div
			className="flex justify-start items-center p-1 gap-4 select-none"
			style={fadeIn}
		>
			<img
				src={props.converSrc}
				alt="Uhh"
				className="h-full aspect-square border border-slate-800 
						   rounded-md transition-transform hover:scale-105 object-cover"
			/>
			<div>
				<h1
					className="hover:underline font-bold cursor-pointer"
				>
					{props.title}
				</h1>
				<p
					className="hover:underline text-sm text-slate-400 cursor-pointer"
				>
					{props.artist}
				</p>
			</div>
		</animated.div>
	);
}
