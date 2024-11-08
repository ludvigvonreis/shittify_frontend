import { AccentColorAtom, ProgressAtom } from "@atoms/MediaPlayerAtoms";
import Icon from "@components/shared/Icon";
import ProgressBar from "@components/shared/ProgressBar";
import { secondsToClockFormat } from "@utils/time";
import { useAtom, useAtomValue } from "jotai";
import { twMerge } from "tailwind-merge";

export default function MediaControls() {
	const [progressAtom, setProgressAtom] = useAtom(ProgressAtom);
	const accentColor = useAtomValue(AccentColorAtom);
	const duration = 312;

	const iconClassName = "text-[2.5rem] cursor-pointer";
	const sideIconsClassName = "text-[2rem] cursor-pointer";
	return (
		<div className="col-span-2 flex justify-center items-center flex-col select-none">
			<div className="grid grid-cols-5 grid-rows-1 gap-1 items-center">
				<Icon
					type="shuffle"
					className={twMerge(
						sideIconsClassName,
						1 == 1 ? accentColor.text : "bg-slate-500"
					)}
				/>
				<Icon type="fast_rewind" className={iconClassName} />
				<Icon type="play_arrow" className={iconClassName} />
				<Icon type="fast_forward" className={iconClassName} />
				<Icon
					type="repeat"
					className={twMerge(
						sideIconsClassName,
						1 == 1 ? accentColor.text : "text-slate-500"
					)}
				/>
			</div>
			<div className="w-full flex flex-row justify-center items-center">
				<span className="w-5 text-slate-400">
					{secondsToClockFormat(progressAtom.progress)}
				</span>
				<ProgressBar
					className="w-3/4 ml-5 mr-2"
					percentage={progressAtom.progress / duration}
					onChangeProgress={(value) => {
						setProgressAtom({
							progress: value * duration,
							isProgressChanged: true,
						});
					}}
				/>
				<span className="w-5 text-slate-400">
					{secondsToClockFormat(duration)}
				</span>
			</div>
		</div>
	);
}
