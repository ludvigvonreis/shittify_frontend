import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const ProgressAtom = atom({
	progress: 0,
	isProgressChanged: false,
});

export const VolumeAtom = atomWithStorage('volume', 1);

export const TogglesAtom = atomWithStorage('toggles', {
	isPlaying: false,
	isLooping: false,
	isShuffle: false,
});

export const MediaAtom = atom({
	queue: [] as Track[],
	queueIndex: 0,
})

export const CurrentTrackAtom = atom((get) => {
	const { queue, queueIndex } = get(MediaAtom);
	return queue[queueIndex] || null;
});

export const AccentColorAtom = atomWithStorage('accent-color', { text: "text-rose-400", bg: "bg-rose-400" });
