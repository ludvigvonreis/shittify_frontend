import {
	MediaNodesAtom,
	ProgressAtom,
	TogglesAtom,
	VolumeAtom,
} from "@atoms/MediaPlayerAtoms";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";

interface AudioControllerProps {
	src: string;
}

export default function AudioController(props: AudioControllerProps) {
	const audioContext = useRef<AudioContext | null>();

	const audioRef = useRef<HTMLAudioElement | null>(null);
	const [isReady, setIsReady] = useState(false);

	// Atoms
	const mediaToggles = useAtomValue(TogglesAtom);
	const volumeAtom = useAtomValue(VolumeAtom);
	const [mediaProgress, setMediaProgress] = useAtom(ProgressAtom);

	// Media nodes (audio filters)
	const mediaNodes = useRef<IMediaNodes | null>();
	const setMediaNodesAtom = useSetAtom(MediaNodesAtom);

	useEffect(() => {
		setMediaNodesAtom(mediaNodes);
	}, [setMediaNodesAtom]);

	// Initialized audio context.
	useEffect(() => {
		if (!audioRef.current) return;

		const context = new AudioContext();
		const buffer = context.createMediaElementSource(audioRef.current);

		// Create a gain node
		const gainNode = context.createGain();
		gainNode.gain.value = volumeAtom || 1;

		// Connect the buffer to the gain node
		buffer.connect(gainNode);

		// Connect the gain node to the context's destination
		gainNode.connect(context.destination);

		mediaNodes.current = {
			gainNode: gainNode,
		};

		audioContext.current = context;

		return () => {
			context.close();
		};
	}, [audioRef.current]);

	// React to play / pause.
	useEffect(() => {
		if (!audioContext.current) return;
		if (!audioRef.current) return;
		if (!isReady) return;

		const context = audioContext.current;
		const audioElement = audioRef.current;

		// Resume the AudioContext if it's in a suspended state
		if (context.state === "suspended") {
			context.resume().then(() => {
				console.debug("AudioContext resumed");
			});
		}

		if (mediaToggles.isPlaying === true) {
			audioElement.play().catch((e) => {
				console.error("Error playing audio:", e);
			});
		} else {
			audioElement.pause();
		}
	}, [mediaToggles.isPlaying, isReady]);

	// React to volume changes
	useEffect(() => {
		if (!mediaNodes.current) return;

		mediaNodes.current.gainNode.gain.value = volumeAtom;
	}, [volumeAtom]);

	// React to audio time updating
	function onTimeUpdate() {
		if (!audioRef.current) return;

		setMediaProgress({
			...mediaProgress,
			isProgressChanged: false,
			progress: audioRef.current.currentTime,
		});
	}

	// React to outside progress changing, ie: progress bar skipping.
	useEffect(() => {
		if (mediaProgress.isProgressChanged === false) return;
		if (!audioRef.current) return;

		audioRef.current.currentTime = mediaProgress.progress;
	}, [mediaProgress]);

	if (props.src === "") return;

	return (
		<audio
			ref={audioRef}
			autoPlay={mediaToggles.isPlaying}
			src={props.src} // Replace with your default audio file
			onCanPlay={() => {
				setIsReady(true);
			}}
			onError={(e) => console.log(e)}
			onTimeUpdate={onTimeUpdate}
			preload="metadata" // Preload metadata for duration
			crossOrigin="anonymous"
		></audio>
	);
}
