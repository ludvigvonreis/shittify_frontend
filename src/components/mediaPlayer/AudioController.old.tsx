import {
	CurrentTrackAtom,
	MediaAtom,
	ProgressAtom,
	TogglesAtom,
	VolumeAtom,
} from "@atoms/MediaPlayerAtoms";
import { useOnTrackEnd } from "@hooks/mediaHooks";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useState } from "react";


export default function AudioControllerOld() {
	const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
	const [isReady, setIsReady] = useState(false);

	const [mediaProgress, setMediaProgress] = useAtom(ProgressAtom);
	const [mediaAtom, setMediaAtom] = useAtom(MediaAtom);
	const volumeAtom = useAtomValue(VolumeAtom);
	const mediaToggles = useAtomValue(TogglesAtom);
	const currentTrack = useAtomValue(CurrentTrackAtom);

	const onTrackEnd = useOnTrackEnd();

	useEffect(() => {
		const audioElm = new Audio(currentTrack ? currentTrack.path : "");
		audioElm.autoplay = mediaToggles.isPlaying;
		audioElm.load();
		audioElm.volume = volumeAtom;

		audioElm.addEventListener("canplay", () => {
			setIsReady(true);
		});

		audioElm.addEventListener("timeupdate", () => {
			setMediaProgress({
				isProgressChanged: false,
				progress: audioElm.currentTime,
			});
		});

		audioElm.addEventListener("ended", () => {
			onTrackEnd();
		});

		setAudioRef(audioElm);

		return () => {
			setAudioRef(null);
			audioElm.src = "";
		}

	}, [currentTrack ? currentTrack.path : ""]);

	useEffect(() => {
		if (audioRef === null) return;
		if (isReady === false) return;

		// Set duration to loaded duration from mp3.
		const updatedQueue = mediaAtom.queue.map((item, idx) =>
			idx === mediaAtom.queueIndex
				? { ...item, duration: audioRef.duration } // Update the targeted element
				: item // Leave other elements unchanged
		);

		setMediaAtom({...mediaAtom, queue: updatedQueue});
	}, [isReady])


	useEffect(() => {
		if (audioRef === null) return;
		if (isReady === false) return;

		if (mediaToggles.isPlaying) {
			audioRef.play().catch((e) => {
				console.error("Audio error: ", e);
			});
		} else {
			audioRef.pause();
		}
	}, [mediaToggles.isPlaying]);

	useEffect(() => {
		if (audioRef === null) return;

		if (mediaProgress.isProgressChanged == true) {
			audioRef.currentTime = mediaProgress.progress;
			setMediaProgress({ ...mediaProgress, isProgressChanged: false });
		}
	}, [mediaProgress.isProgressChanged]);

	useEffect(() => {
		if (audioRef === null) return;

		audioRef.volume = volumeAtom;
	}, [volumeAtom]);

	useEffect(() => {
		if (mediaToggles.isPlaying) {
			audioRef?.play();
		} else {
			audioRef?.pause();
		}
	}, [mediaAtom.queueIndex])

	return <></>;
}
