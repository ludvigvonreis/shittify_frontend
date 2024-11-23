import { AccentColorAtom } from "@atoms/MediaPlayerAtoms";
import Icon from "@components/shared/Icon";
import { Link } from "@tanstack/react-router";
import { secondsToClockFormat } from "@utils/time";
import { useAtomValue } from "jotai";
import { twMerge } from "tailwind-merge";

interface ITrackListItem {
	element: Track;
	queue: Track[];
	currentTrack?: Track;
	index: number;
	onDoubleClick: () => void;
	addToQueue: () => void;
}

export default function TrackListItem({
	element,
	queue,
	currentTrack,
	index,
	onDoubleClick,
	addToQueue,
}: ITrackListItem) {
	const accentColor = useAtomValue(AccentColorAtom);

	const isCurrentTrack = currentTrack?.track_id === element.track_id;
	const playPauseIcon = isCurrentTrack ? "pause" : "play_arrow";
	const trackTextStyle = isCurrentTrack ? accentColor.text : "";
	const isInQueue = queue.includes(element);

	return (
		<article
			className="grid grid-cols-[50px_1fr_2rem_3rem] select-none group
    		items-center hover:bg-slate-800 rounded-md px-2 py-2"
			onDoubleClick={onDoubleClick}
		>
			{/* Thumbnail/Play-Pause Section */}
			<div className="relative flex items-center justify-center w-12 h-12 overflow-hidden">
				{/* Track Index */}
				<span
					className={twMerge(
						`absolute w-full h-full flex items-center justify-center 
						text-lg opacity-100 group-hover:opacity-0`,
						trackTextStyle
					)}
				>
					{element.index}
				</span>
				{/* Play/Pause Icon */}
				<Icon
					type={playPauseIcon}
					className="absolute w-full h-full flex items-center 
        			justify-center text-xl opacity-0 group-hover:opacity-100"
				/>
			</div>

			{/* Track and Artist Details */}
			<div className="flex flex-col">
				<Link>
					<span
						className={twMerge(
							"hover:underline w-max",
							trackTextStyle
						)}
					>
						{element.name}
					</span>
				</Link>
				<Link>
					<span className="font-light text-sm hover:underline w-max text-slate-400">
						{element.artist}
					</span>
				</Link>
			</div>

			{/* Add to Queue Button */}
			<button
				title="Add to Queue"
				className="justify-self-center cursor-pointer opacity-0 text-slate-300
					group-hover:opacity-100 hover:text-inherit"
				onClick={addToQueue}
			>
				<Icon type={"queue_music"} />
			</button>

			{/* Track Duration */}
			<time className="text-right">
				{secondsToClockFormat(element.duration)}
			</time>
		</article>
	);
}
