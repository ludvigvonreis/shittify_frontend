import {
	AccentColorAtom,
	MediaAtom,
	VolumeAtom,
} from "@atoms/MediaPlayerAtoms";
import Icon from "@components/shared/Icon";
import ProgressBar from "@components/shared/ProgressBar";
import { useAtom, useAtomValue } from "jotai";
import FoldingQueue from "./FoldingQueue";
import { FoldAtom } from "@atoms/atoms";
import { twMerge } from "tailwind-merge";
import { useState } from "react";

export default function VolumeControl() {
	const [volumeAtom, setVolumeAtom] = useAtom(VolumeAtom);
	const [isFoldActive, setIsFoldActive] = useAtom(FoldAtom);
	const mediaAtom = useAtomValue(MediaAtom);
	const accentColor = useAtomValue(AccentColorAtom);

	// Muting
	const [lastVolume, setLastVolume] = useState(0);
	const [isMuted, setIsMuted] = useState(volumeAtom == 0);

	function onMute() {
		if (isMuted) {
			setIsMuted(false);
			setVolumeAtom(lastVolume);
		} else {
			setLastVolume(volumeAtom);
			setIsMuted(true);
			setVolumeAtom(0);
		}
	}

	let icon = volumeAtom > 0.5 ? "volume_up" : "volume_down";

	icon = volumeAtom == 0 ? "volume_off" : icon;

	let queueButtonColor = isFoldActive
		? `text-accent hover:text-accent`
		: "";

	queueButtonColor =
		mediaAtom.queue.length === 0
			? "text-slate-600 hover:text-slate-600 cursor-default"
			: queueButtonColor;

	return (
		<div className="flex justify-end items-center mr-5 gap-2 relative">
			<FoldingQueue />
			<Icon
				title="Open Queue"
				type="queue"
				className={twMerge(
					"transition-colors text-slate-300 hover:text-inherit cursor-pointer",
					queueButtonColor
				)}
				onClick={(e) => {
					e.stopPropagation();
					setIsFoldActive((isFoldActive: boolean) =>
						mediaAtom.queue.length > 0 ? !isFoldActive : false
					);
				}}
			/>
			<Icon
				type={icon}
				title="Mute Volume"
				className="transition-colors text-2xl text-slate-300 hover:text-inherit cursor-pointer"
				onClick={onMute}
			/>
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
