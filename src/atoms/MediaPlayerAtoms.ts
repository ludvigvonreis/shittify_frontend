import { atom } from "jotai";

export const ProgressAtom = atom({
	progress: 0,
	isProgressChanged: false,
});

export const VolumeAtom = atom(1);

export const TogglesAtom = atom({
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

export const AccentColorAtom = atom({ text: "text-rose-400", bg: "bg-rose-400" });
