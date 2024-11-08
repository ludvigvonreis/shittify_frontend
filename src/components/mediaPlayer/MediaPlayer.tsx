import CurrentTrack from "./CurrentTrack";
import MediaControls from "./MediaControls";
import VolumeControl from "./VolumeControl";

export default function MediaPlayer() {
	return (
		<div className="w-full h-24 bg-slate-800 fixed bottom-0 grid grid-cols-4 grid-rows-1">
			<CurrentTrack
				title={"Dark Side of The Moon"}
				artist={"Pink Floyd"}
				converSrc={
					"https://1265745076.rsc.cdn77.org/1024/jpg/134180-pink-floyd-dark-side-of-the-moon-LP-64f198fb82963.jpg"
				}
			/>
			<MediaControls />
			<VolumeControl />
		</div>
	);
}
