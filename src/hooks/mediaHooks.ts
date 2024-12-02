import { MediaAtom, ProgressAtom, TogglesAtom } from "@atoms/MediaPlayerAtoms";
import { useAtom, useAtomValue, useSetAtom } from "jotai";

export function useAddToQueue() {
	const [mediaAtom, setMediaAtom] = useAtom(MediaAtom);

	return (track: Track, changeToTrack = false) => {
		if (mediaAtom.queue.some((queuedTrack) => queuedTrack.track_id === track.track_id)) {
			return false;
		}
		
		setMediaAtom((mediaAtom) => {
			return {
				...mediaAtom,
				queue: [...mediaAtom.queue, track],
				queueIndex: changeToTrack
					? mediaAtom.queue.length
					: mediaAtom.queueIndex,
			};
		});

		return true;
	};
}

export function useSetQueue() {
	const setMediaAtom = useSetAtom(MediaAtom);
	const setProgressAtom = useSetAtom(ProgressAtom);
	const setTogglesAtom = useSetAtom(TogglesAtom);

	return (tracks: Track[], startPlay = false) => {
		setMediaAtom((mediaAtom) => {
			return { ...mediaAtom, queue: [...tracks], queueIndex: 0 };
		});

		setProgressAtom((progressAtom) => {
			return { ...progressAtom, progress: 0, isProgressChanged: true };
		});

		setTogglesAtom((toggles) => {
			return { ...toggles, isPlaying: startPlay };
		});
	};
}

export function useSetQueueIndex() {
	const [mediaAtom, setMediaAtom] = useAtom(MediaAtom);
	const setProgressAtom = useSetAtom(ProgressAtom);

	return (newIndex: number, relative = false) => {
		if (relative == true) {
			newIndex = mediaAtom.queueIndex + newIndex;
		}

		if (newIndex >= mediaAtom.queue.length) {
			newIndex = 0;
		}

		if (newIndex < 0) {
			setProgressAtom((progressAtom) => {
				return {
					...progressAtom,
					progress: 0,
					isProgressChanged: true,
				};
			});
			return false;
		}

		setMediaAtom((mediaAtom) => {
			return { ...mediaAtom, queueIndex: newIndex };
		});

		setProgressAtom((progressAtom) => {
			return { ...progressAtom, progress: 0, isProgressChanged: true };
		});

		return true;
	};
}

export function useOnTrackEnd() {
	const [mediaAtom, setMediaAtom] = useAtom(MediaAtom);
	const [mediaToggles, setMediaToggles] = useAtom(TogglesAtom);

	return () => {
		let newIndex = mediaAtom.queueIndex + 1;

		if (newIndex >= mediaAtom.queue.length) {
			if (mediaToggles.isLooping === true) {
				newIndex = 0;
			} else {
				newIndex = mediaAtom.queueIndex;
				setMediaToggles({ ...mediaToggles, isPlaying: false });
			}
		}

		setMediaAtom({ ...mediaAtom, queueIndex: newIndex });
	};
}

export function useShuffleQueue() {
	const [mediaAtom, setMediaAtom] = useAtom(MediaAtom);

	return () => {
		if (mediaAtom.queue.length < 0) return;

		const fixedIndex = mediaAtom.queueIndex;
		// Copy the original array to avoid mutating it
		const result = [...mediaAtom.queue];

		// Remove the fixed element
		const fixedElement = result[fixedIndex];
		result.splice(fixedIndex, 1);
		
		// Shuffle the remaining elements
		for (let i = result.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[result[i], result[j]] = [result[j], result[i]];
		}
		
		// Reinsert the fixed element at its original position
		result.splice(fixedIndex, 0, fixedElement);

		setMediaAtom({...mediaAtom, queue: result});
	}
}
