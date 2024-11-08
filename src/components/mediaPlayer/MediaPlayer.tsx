import { useAtom, useAtomValue } from "jotai";
import CurrentTrack from "./CurrentTrack";
import MediaControls from "./MediaControls";
import VolumeControl from "./VolumeControl";
import { CurrentTrackAtom, MediaAtom } from "@atoms/MediaPlayerAtoms";
import { useSetQueue } from "@hooks/mediaHooks";
import { useEffect } from "react";

export default function MediaPlayer() {
	const [mediaAtom, setMediaAtom] = useAtom(MediaAtom);
	const currentTrack = useAtomValue(CurrentTrackAtom);

	const setQueue = useSetQueue();

	useEffect(() => {
		setQueue([
			{
				artist_id: "",
				artist: "Pink Floyd",
				album_id: "",
				album: "Dark Side of The Moon",
				track_id: "",
				name: "Time",
				duration: 120,
				index: 3,
				path: "",
				image: "https://1265745076.rsc.cdn77.org/1024/jpg/134180-pink-floyd-dark-side-of-the-moon-LP-64f198fb82963.jpg",
			},
		]);
	}, []);

	return (
		<div className="w-full h-24 bg-slate-800 fixed bottom-0 grid grid-cols-4 grid-rows-1">
			<CurrentTrack
				title={currentTrack ? currentTrack.name : ""}
				artist={currentTrack ? currentTrack.artist : ""}
				converSrc={
					currentTrack
						? currentTrack.image
						: "https://artists.apple.com/assets/artist-og-share-c766a5950ae664ea9073ede99da0df1094ae1a24bee32b86ab9e43e7e02bce2e.jpg"
				}
			/>
			<MediaControls />
			<VolumeControl />
		</div>
	);
}
