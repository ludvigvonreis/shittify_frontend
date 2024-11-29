import {
	AccentColorAtom,
	MediaAtom,
	TogglesAtom,
	VolumeAtom,
} from "@atoms/MediaPlayerAtoms";
import Icon from "@components/shared/Icon";
import ProgressBar from "@components/shared/ProgressBar";
import { useAtom, useAtomValue } from "jotai";
import FoldingQueue from "./FoldingQueue";
import { FoldAtom } from "@atoms/atoms";
import { twMerge } from "tailwind-merge";
import { useEffect, useState } from "react";

export default function VolumeControl() {
	const [volumeAtom, setVolumeAtom] = useAtom(VolumeAtom);
	const [isFoldActive, setIsFoldActive] = useAtom(FoldAtom);
	const mediaAtom = useAtomValue(MediaAtom);
	const [mediaToggles, setMediaToggles] = useAtom(TogglesAtom);

	// Muting
	const [lastVolume, setLastVolume] = useState(0.5);

	useEffect(()=>{
		if (mediaToggles.isMuted) {
			setLastVolume(volumeAtom);
			setVolumeAtom(0);
		} else {
			setVolumeAtom(lastVolume > 0 ? lastVolume : 0.5);
		}
	},[mediaToggles.isMuted])


	let icon = volumeAtom > 0.5 ? "volume_up" : "volume_down";

	icon = mediaToggles.isMuted ? "volume_off" : icon;

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
				title={!isFoldActive ? "Open Queue" : "Close Queue"}
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
				title={mediaToggles.isMuted ? "Mute (m)" : "Unmute (m)"}
				className="transition-colors text-2xl text-slate-300 hover:text-inherit cursor-pointer"
				onClick={() => 
					setMediaToggles({...mediaToggles, isMuted: !mediaToggles.isMuted})
				}
			/>
			<ProgressBar
				percentage={volumeAtom}
				onChangeProgress={(newValue) => {
					setVolumeAtom(newValue);
					if (newValue > 0 && mediaToggles.isMuted) {
						setMediaToggles({...mediaToggles, isMuted: false});
					}
				}}
				className="w-32 h-2"
			/>
		</div>
	);
}
