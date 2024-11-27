import {
	MediaAtom,
	MediaNodesAtom,
	ProgressAtom,
	TogglesAtom,
	VolumeAtom,
} from "@atoms/MediaPlayerAtoms";
import { useSetQueueIndex } from "@hooks/mediaHooks";
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
	const [mediaToggles, setMediaToggles] = useAtom(TogglesAtom);
	const volumeAtom = useAtomValue(VolumeAtom);
	const [mediaAtom, setMediaAtom] = useAtom(MediaAtom);
	const [mediaProgress, setMediaProgress] = useAtom(ProgressAtom);

	// Hooks
	const setQueueIndex = useSetQueueIndex();

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

		// Loading progress that was saved from last "page reload" or something like that
		const progressSaved = Number(
			localStorage.getItem("progress_saved") || 0
		);
		setMediaProgress({
			...mediaProgress,
			progress: progressSaved,
			isProgressChanged: true,
		});

		// Create a gain node
		const gainNode = context.createGain();
		gainNode.gain.value = Number(localStorage.getItem("volume")) || 0;

		const analyzer = context.createAnalyser();

		// Connect the nodes to the destination.
		buffer
			.connect(analyzer) // connect analyzer
			.connect(gainNode) // connect gain
			.connect(context.destination);

		mediaNodes.current = {
			gainNode: gainNode,
			analyzerNode: analyzer,
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

	useEffect(() => {
		if (!audioRef.current) return;
		if (!isReady) return;

		const duration = audioRef.current.duration || 0;

		// Set duration to loaded duration from mp3.
		const updatedQueue = mediaAtom.queue.map(
			(item, idx) =>
				idx === mediaAtom.queueIndex
					? { ...item, duration: duration } // Update the targeted element
					: item // Leave other elements unchanged
		);

		setMediaAtom({ ...mediaAtom, queue: updatedQueue });
	}, [isReady]);

	// React to volume changes
	useEffect(() => {
		if (!mediaNodes.current) return;

		mediaNodes.current.gainNode.gain.value = volumeAtom;
	}, [volumeAtom]);

	// React to audio time updating
	function onTimeUpdate() {
		if (!audioRef.current) return;
		if (!isReady) return;

		setMediaProgress({
			...mediaProgress,
			isProgressChanged: false,
			progress: audioRef.current.currentTime,
		});
		localStorage.setItem(
			"progress_saved",
			audioRef.current.currentTime.toString()
		);
	}

	// React to outside progress changing, ie: progress bar skipping.
	useEffect(() => {
		if (mediaProgress.isProgressChanged === false) return;
		if (!audioRef.current) return;
		if (!isReady) return;

		audioRef.current.currentTime = mediaProgress.progress;
		setMediaProgress({ ...mediaProgress, isProgressChanged: false });
		localStorage.setItem(
			"progress_saved",
			mediaProgress.progress.toString()
		);
	}, [mediaProgress]);

	useEffect(() => {
		// TODO: Figure out how to keep this reactive to the current queue index
		// Right now it can skip forward one song or back one song. but its only +1 at
		// the queue index relative to first render
		/*if ("mediaSession" in navigator) {
			navigator.mediaSession.setActionHandler("previoustrack", () => {
				console.log("prevtrack");
				setQueueIndex(-1, true);
			});
			navigator.mediaSession.setActionHandler("nexttrack", () => {
				console.log("nexttrack");
				setQueueIndex(1, true);
			});
		}*/

		function handleInput(event: KeyboardEvent) {
			const target = event.target as HTMLElement;
			const isInputFocused =
				target.tagName === "INPUT" ||
				target.tagName === "TEXTAREA" ||
				target.tagName === "SELECT" ||
				target.isContentEditable; // For contenteditable divs

			if (isInputFocused) return;

			switch (event.code) {
				case "Space":
					event.preventDefault();
					setMediaToggles((toggles) => {
						return {
							...mediaToggles,
							isPlaying: !toggles.isPlaying,
						};
					});
					break;

				case "KeyM":
					event.preventDefault();
					setMediaToggles((toggles) => {
						return { ...mediaToggles, isMuted: !toggles.isMuted };
					});
					break;

				// Add other cases here if needed (e.g., other keys you want to handle)

				default:
					// Optionally handle default case if needed
					break;
			}
		}

		document.addEventListener("keydown", handleInput);

		return () => {
			document.removeEventListener("keydown", handleInput);
		};
	}, []);

	if (props.src === "") return;

	return (
		<audio
			ref={audioRef}
			autoPlay={mediaToggles.isPlaying}
			src={props.src} // Replace with your default audio file
			preload="metadata" // Preload metadata for duration
			crossOrigin="anonymous"
			onCanPlay={() => {
				setIsReady(true);
			}}
			onError={(e) => console.log(e)}
			onTimeUpdate={onTimeUpdate}
			onEnded={() => {
				// add one to queue index when song has ended
				setQueueIndex(1, true);
				setMediaToggles({ ...mediaToggles, isPlaying: true });
			}}
			// Handle outside forces pausing/playing and make the
			// local state reflect this change
			onPlay={() => {
				setMediaToggles({ ...mediaToggles, isPlaying: true });
			}}
			onPause={() => {
				setMediaToggles({ ...mediaToggles, isPlaying: false });
			}}
		></audio>
	);
}
