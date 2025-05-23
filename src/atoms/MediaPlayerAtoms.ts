import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const ProgressAtom = atom({
	progress: 0,
	isProgressChanged: false
});

export const VolumeAtom = atomWithStorage('volume', 1);

export const TogglesAtom = atomWithStorage('toggles', {
	isPlaying: false,
	isLooping: false,
	isShuffle: false,
	isMuted: false,
});

export const MediaAtom = atomWithStorage("queue", {
	queue: [] as Track[],
	queueIndex: 0,
})

export const CurrentTrackAtom = atom((get) => {
	const { queue, queueIndex } = get(MediaAtom);
	return queue[queueIndex] || null;
});

export const MediaNodesAtom = atom<React.MutableRefObject<IMediaNodes | null | undefined> | null>();
