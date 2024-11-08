import { MediaAtom, ProgressAtom } from "@atoms/MediaPlayerAtoms";
import { useSetAtom } from "jotai";

export function useSetQueue() {
	const setMediaAtom = useSetAtom(MediaAtom);
	const setProgressAtom = useSetAtom(ProgressAtom);

	return (tracks: Track[]) => {
		setMediaAtom((mediaAtom) => {
			return { ...mediaAtom, queue: [...tracks], queueIndex: 0 };
		});

		setProgressAtom((progressAtom) => {
			return { ...progressAtom, progress: 0, isProgressChanged: true };
		});
	};
}
