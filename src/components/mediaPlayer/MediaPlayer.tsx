import CurrentTrack from "./CurrentTrack";
import MediaControls from "./MediaControls";
import VolumeControl from "./VolumeControl";

export default function MediaPlayer() {
	return (
		<div className="w-full h-24 bg-slate-700 fixed bottom-0 grid grid-cols-4 grid-rows-1 pl-5 pr-5">
			<CurrentTrack />
			<MediaControls />
			<VolumeControl />
		</div>
	);
}
