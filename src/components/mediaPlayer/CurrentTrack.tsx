import { useSpring, animated } from "@react-spring/web";
import { Link } from "@tanstack/react-router";
import { memo } from "react";

interface CurrentTrackProps {
	title: string;
	artist: string;
	converSrc: string;
	album_id: string;
	artist_id: string;
}

function CurrentTrack(props: CurrentTrackProps) {
	const fadeIn = useSpring({
		from: { opacity: 0, transform: "translateY(20px)" },
		to: { opacity: 1, transform: "translateY(0px)" },
		reset: true,
		config: { tension: 200, friction: 20, duration: 200 },
	});

	if (props.title === "Unknown") return <div></div>;

	return (
		<div className="flex justify-start items-center p-1 gap-4 select-none relative">
			<div className="absolute w-full h-full top-0" />
			<img
				src={props.converSrc}
				alt="Uhh"
				className="h-full aspect-square border border-slate-800 
						rounded-md transition-transform hover:scale-105 object-cover"
			/>
			<animated.div style={fadeIn}>
				<Link to="/album/$albumid" params={{albumid: props.album_id}}>
					<h1 className="hover:underline font-medium cursor-pointer">
						{props.title}
					</h1>
				</Link>
				<Link>
					<p className="hover:underline text-sm font-light text-slate-400 cursor-pointer inline-block">
						{props.artist}
					</p>
				</Link>
			</animated.div>
		</div>
	);
}


export default memo(CurrentTrack);