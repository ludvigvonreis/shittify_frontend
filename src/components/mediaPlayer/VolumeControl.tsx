import {
	AccentColorAtom,
	MediaAtom,
	VolumeAtom,
} from "@atoms/MediaPlayerAtoms";
import Icon from "@components/shared/Icon";
import ProgressBar from "@components/shared/ProgressBar";
import { useAtom, useAtomValue } from "jotai";
import FoldingQueue from "./FoldingQueue";
import { foldAtom } from "@atoms/atoms";
import { twMerge } from "tailwind-merge";

export default function VolumeControl() {
	const [volumeAtom, setVolumeAtom] = useAtom(VolumeAtom);
	const [isFoldActive, setIsFoldActive] = useAtom(foldAtom);
	const mediaAtom = useAtomValue(MediaAtom);
	const accentColor = useAtomValue(AccentColorAtom);

	const icon =
		volumeAtom > 0.1
			? volumeAtom > 0.5
				? "volume_up"
				: "volume_down"
			: "volume_mute";

	const queueButtonColor = isFoldActive ? accentColor.text : "";

	return (
		<div className="flex justify-end items-center mr-5 gap-2">
			<FoldingQueue />
			<Icon
				title="Open Queue"
				type="queue"
				className={twMerge("transition-colors", queueButtonColor)}
				onClick={(e) => {
					e.stopPropagation();
					setIsFoldActive((isFoldActive: boolean) =>
						mediaAtom.queue.length > 1 ? !isFoldActive : false
					);
				}}
			/>
			<Icon type={icon} className="text-2xl" />
			<ProgressBar
				percentage={volumeAtom}
				onChangeProgress={(newValue) => {
					setVolumeAtom(newValue);
				}}
				className="w-32 h-2"
			/>
		</div>
	);
}
