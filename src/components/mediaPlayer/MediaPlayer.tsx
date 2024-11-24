import { useAtom, useAtomValue } from "jotai";
import CurrentTrack from "./CurrentTrack";
import MediaControls from "./MediaControls";
import VolumeControl from "./VolumeControl";
import { CurrentTrackAtom, MediaAtom } from "@atoms/MediaPlayerAtoms";
import { useSetQueue } from "@hooks/mediaHooks";
import { memo, useEffect } from "react";
import AudioController from "./AudioController";
import Toast from "@components/shared/Toast";

function MediaPlayer() {
	const currentTrack = useAtomValue(CurrentTrackAtom);

	const setQueue = useSetQueue();

	useEffect(() => {
		setQueue([
			{
				artist_id: "",
				artist: "Masayoshi Takanaka",
				album_id: "",
				album: "The Rainbow Goblins",
				track_id: "",
				name: "The Seven Goblins",
				duration: 192,
				index: 3,
				path: "http://localhost:3000/v1/static/tracks/oRcLE6ggK1SxhI2GlvxB9.mp3",
				image: "http://localhost:3000/v1/static/images/yIpx__cbkgcDqn-5MExIG.png",
			},
			{
				artist_id: "",
				artist: "The Strokes",
				album_id: "",
				album: "Is This It",
				track_id: "",
				name: "Soma",
				duration: 154,
				index: 8,
				path: "http://localhost:3000/v1/static/tracks/JhEMJxyvocHwj9PxmuKrH.mp3",
				image: "http://localhost:3000/v1/static/images/lmqvyYaeM-GMCY4zlRA0f.png",
			},
			{
				artist_id: "KAVcotc8s30hqndLSpNfG",
				artist: "Pink Floyd",
				album_id: "JkyvyRY6GBuJ9eDvmVt6r",
				album: "The Wall",
				image: "http://localhost:3000/v1/static/images/9JiEfD2STlyGgw0zpbEhC.png",
				track_id: "OrzZgVgEAGyAcv7VZNtlP",
				name: "One Of My Turns",
				duration: 216,
				index: 10,
				path: "http://localhost:3000/v1/static/tracks/L0AziOphiBEVUOVhZU1H1.mp3",
			},
			{
				artist_id: "KAVcotc8s30hqndLSpNfG",
				artist: "Pink Floyd",
				album_id: "JkyvyRY6GBuJ9eDvmVt6r",
				album: "The Wall",
				image: "http://localhost:3000/v1/static/images/9JiEfD2STlyGgw0zpbEhC.png",
				track_id: "uzIFoKsgcz5m_K42Mw9NH",
				name: "Another Brick In The Wall (Part 2)",
				duration: 238,
				index: 5,
				path: "http://localhost:3000/v1/static/tracks/S9S6sNSHgwn98ZRoGoBbU.mp3",
			},
			{
				artist_id: "lo1HTr9iEldVYXi-WVZaN",
				artist: "The Strokes",
				album_id: "Zd1ynA7aPAuvWbyjdLc0g",
				album: "Is This It",
				image: "http://localhost:3000/v1/static/images/lmqvyYaeM-GMCY4zlRA0f.png",
				track_id: "wJxaWAhLWqqQVprVFne1Y",
				name: "The Modern Age",
				duration: 208,
				index: 2,
				path: "http://localhost:3000/v1/static/tracks/QKxnyaP1qvrIMGu4AxKfD.mp3",
			},
		]);
	}, []);

	return (
		<footer className="w-full h-24 bg-slate-800 fixed bottom-0 grid grid-cols-4 grid-rows-1">
			<Toast />

			<CurrentTrack
				title={currentTrack ? currentTrack.name : "Unknown"}
				artist={currentTrack ? currentTrack.artist : "Unknown"}
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
