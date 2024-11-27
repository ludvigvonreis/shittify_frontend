import {
	CurrentTrackAtom,
	ProgressAtom,
	TogglesAtom,
} from "@atoms/MediaPlayerAtoms";
import Icon from "@components/shared/Icon";
import ProgressBar from "@components/shared/ProgressBar";
import { useSetQueueIndex, useShuffleQueue } from "@hooks/mediaHooks";
import { useSpring } from "@react-spring/web";
import { secondsToClockFormat } from "@utils/time";
import { useAtom, useAtomValue } from "jotai";
import { twMerge } from "tailwind-merge";

export default function MediaControls() {
	const [progressAtom, setProgressAtom] = useAtom(ProgressAtom);
	const [togglesAtom, setTogglesAtom] = useAtom(TogglesAtom);
	const currentTrack = useAtomValue(CurrentTrackAtom);

	const setQueueIndex = useSetQueueIndex();
	const shuffleQueue = useShuffleQueue();

	const duration = currentTrack ? currentTrack.duration : 0;

	const paths = {
		iconA: "M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z",
  		iconB: "M 12,26 16,26 16,10 12,10 z M 21,26 25,26 25,10 21,10 z"
	};

	const { d } = useSpring({
		d: togglesAtom.isPlaying ? paths.iconB : paths.iconA,
		config: { duration: 100 },
	});

	// Styling for icons
	const iconClassName =
		"text-[2.5rem] cursor-pointer text-slate-300 hover:text-white";
	const sideIconsClassName =
		"text-[2rem] cursor-pointer transition-all duration-500 ease-out hover:scale-105";
	const shuffleColor = togglesAtom.isShuffle
		? "text-accent"
		: "text-slate-500";
	const loopColor = togglesAtom.isLooping ? "text-accent" : "text-slate-500";
	return (
		<div className="col-span-2 flex justify-center items-center flex-col select-none">
			<div className="grid grid-cols-5 grid-rows-1 gap-1 items-center">
				<Icon
					title={
						!togglesAtom.isShuffle
							? "Shuffle Queue"
							: "Unshuffle Queue"
					}
					type="shuffle"
					className={twMerge(sideIconsClassName, shuffleColor)}
					onClick={() => {
						setTogglesAtom({
							...togglesAtom,
							isShuffle: !togglesAtom.isShuffle,
						});

						if (togglesAtom.isShuffle === true) shuffleQueue();
					}}
				/>
				<Icon
					title="Previous"
					type="fast_rewind"
					className={iconClassName}
					onClick={() => {
						// Subtract one from index, relative to current index
						setQueueIndex(-1, true);
					}}
				/>
				<Icon.SVG
					title={!togglesAtom.isPlaying ? "Play (space)" : "Pause (space)"}
					path={d}
					viewBox="0 0 36 36"
					className="size-[2.5rem] scale-125 cursor-pointer fill-slate-300 hover:fill-white"
					onClick={() =>
						setTogglesAtom({
							...togglesAtom,
							isPlaying: !togglesAtom.isPlaying,
						})
					}
				/>
				<Icon
					title="Next"
					type="fast_forward"
					className={iconClassName}
					onClick={() => {
						// Add one to index, relative to current index
						setQueueIndex(1, true);
					}}
				/>
				<Icon
					title={
						!togglesAtom.isLooping
							? "Enable Repeat"
							: "Disable Repeat"
					}
					type="repeat"
					className={twMerge(sideIconsClassName, loopColor)}
					onClick={() =>
						setTogglesAtom({
							...togglesAtom,
							isLooping: !togglesAtom.isLooping,
						})
					}
				/>
			</div>
			<div className="w-full flex flex-row justify-center gap-3 items-center">
				<span className="w-10 text-slate-400">
					{secondsToClockFormat(progressAtom.progress)}
				</span>
				<ProgressBar
					className="w-3/4"
					percentage={progressAtom.progress / duration}
					onChangeProgress={(value) => {
						setProgressAtom({
							progress: value * duration,
							isProgressChanged: true,
						});
					}}
				/>
				<span className="w-10 text-slate-400">
					{secondsToClockFormat(duration)}
				</span>
			</div>
		</div>
	);
}
