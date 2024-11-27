import {
	CurrentTrackAtom,
	ProgressAtom,
	TogglesAtom,
} from "@atoms/MediaPlayerAtoms";
import Icon from "@components/shared/Icon";
import ProgressBar from "@components/shared/ProgressBar";
import { useSetQueueIndex, useShuffleQueue } from "@hooks/mediaHooks";
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

	// Styling for icons
	const iconClassName =
		"text-[2.5rem] cursor-pointer hover:scale-110 text-slate-300 hover:text-white";
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
				<Icon
					title={!togglesAtom.isPlaying ? "Play" : "Pause"}
					type={!togglesAtom.isPlaying ? "play_arrow" : "pause"}
					className={iconClassName}
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
