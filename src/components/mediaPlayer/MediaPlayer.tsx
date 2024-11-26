import { useAtomValue } from "jotai";
import CurrentTrack from "./CurrentTrack";
import MediaControls from "./MediaControls";
import VolumeControl from "./VolumeControl";
import { CurrentTrackAtom } from "@atoms/MediaPlayerAtoms";
import { memo } from "react";
import AudioController from "./AudioController";
import Toast from "@components/shared/Toast";

function MediaPlayer() {
	const currentTrack = useAtomValue(CurrentTrackAtom);

	return (
		<footer className="w-full h-24 bg-slate-800 fixed bottom-0 grid grid-cols-4 grid-rows-1">
			<Toast />

			<CurrentTrack
				title={currentTrack ? currentTrack.name : "Unknown"}
				album_id={currentTrack ? currentTrack.album_id : ""}
				artist={currentTrack ? currentTrack.artist : "Unknown"}
				artist_id={currentTrack ? currentTrack.album_id : ""}
				converSrc={
					currentTrack
						? currentTrack.image
						: "https://artists.apple.com/assets/artist-og-share-c766a5950ae664ea9073ede99da0df1094ae1a24bee32b86ab9e43e7e02bce2e.jpg"
				}
			/>
			<MediaControls />
			<VolumeControl />
			<AudioController src={currentTrack ? currentTrack.path : ""} />
		</footer>
	);
}

export default memo(MediaPlayer);
