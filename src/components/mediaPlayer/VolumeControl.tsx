import { VolumeAtom } from "@atoms/MediaPlayerAtoms";
import Icon from "@components/shared/Icon";
import ProgressBar from "@components/shared/ProgressBar";
import { useAtom } from "jotai";

export default function VolumeControl() {
	const [volumeAtom, setVolumeAtom] = useAtom(VolumeAtom);

	const icon =
		volumeAtom > 0.1
			? volumeAtom > 0.5
				? "volume_up"
				: "volume_down"
			: "volume_mute";

	return (
		<div className="flex justify-end items-center mr-5 gap-2">
			<Icon type={icon} className="text-xl"/>
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
