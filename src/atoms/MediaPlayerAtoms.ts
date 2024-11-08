import { atom } from "jotai";

export const ProgressAtom = atom({
	progress: 0,
	isProgressChanged: false,
})