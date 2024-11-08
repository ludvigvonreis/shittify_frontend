import { atom } from "jotai";

export const ProgressAtom = atom({
	progress: 0,
	isProgressChanged: false,
});

export const VolumeAtom = atom(1);

export const AccentColorAtom = atom({ text: "text-rose-400", bg: "bg-rose-400" });
