import { useSpring, animated } from "@react-spring/web";
import { MediaAtom } from "@atoms/MediaPlayerAtoms";
import { useAtomValue, useSetAtom } from "jotai";
import { foldAtom } from "@atoms/atoms";

interface CurrentTrackProps {
	title: string;
	artist: string;
	converSrc: string;
}

export default function CurrentTrack(props: CurrentTrackProps) {
	const fadeIn = useSpring({
		from: { opacity: 0, transform: "translateY(20px)" },
		to: { opacity: 1, transform: "translateY(0px)" },
		reset: true,
		config: { tension: 200, friction: 20, duration: 200 },
	});

	return (
		<>
			<div className="flex justify-start items-center p-1 gap-4 select-none relative">
				<div
					className="absolute w-full h-full top-0"
				/>
				<img
					src={props.converSrc}
					alt="Uhh"
					className="h-full aspect-square border border-slate-800 
						   rounded-md transition-transform hover:scale-105 object-cover"   
				/>
				<animated.div style={fadeIn}>
					<h1 className="hover:underline font-medium cursor-pointer">
						{props.title}
					</h1>
					<p className="hover:underline text-sm font-light text-slate-400 cursor-pointer inline-block">
						{props.artist}
					</p>
				</animated.div>
			</div>
		</>
	);
}
