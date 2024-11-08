import { ProgressAtom } from "@atoms/MediaPlayerAtoms";
import Icon from "@components/shared/Icon";
import ProgressBar from "@components/shared/ProgressBar";
import { secondsToClockFormat } from "@utils/time";
import { useAtom } from "jotai";

export default function MediaControls() {
	const [progressAtom, setProgressAtom] = useAtom(ProgressAtom);
	const duration = 312;

	const iconClassName = "text-[2.5rem] cursor-pointer";
	const sideIconsClassName = "text-[2rem] cursor-pointer";
	return (
		<div className="col-span-2 flex justify-center items-center flex-col gap-3">
			<div className="grid grid-cols-5 grid-rows-1 gap-1 items-center">
				<Icon type="shuffle" className={sideIconsClassName} />
				<Icon type="fast_rewind" className={iconClassName} />
				<Icon type="play_arrow" className={iconClassName} />
				<Icon type="fast_forward" className={iconClassName} />
				<Icon type="repeat" className={sideIconsClassName} />
			</div>
			<div className="w-full flex flex-row justify-center items-center">
				<span className="w-5">{secondsToClockFormat(progressAtom.progress)}</span>
				<ProgressBar
					className="w-3/4 ml-5 mr-5"
					percentage={progressAtom.progress / duration}
					onChangeProgress={(value) => {
						setProgressAtom({
							progress: value * duration,
							isProgressChanged: true,
						});
					}}
				/>
				<span className="w-5">{secondsToClockFormat(duration)}</span>
			</div>
		</div>
	);
}
