import { MediaAtom, ProgressAtom, TogglesAtom } from "@atoms/MediaPlayerAtoms";
import { useAtom, useAtomValue, useSetAtom } from "jotai";

export function useAddToQueue() {
	const [mediaAtom, setMediaAtom] = useAtom(MediaAtom);

	return (track: Track, changeToTrack = false) => {
		if (mediaAtom.queue.includes(track)) return false;

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
