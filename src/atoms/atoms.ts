import { fetchWithAuth } from "@utils/fetchWithAuth";
import { atom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";

export const FoldAtom = atom(false);
export const ToastMessageAtom = atom("");

export const SettingsAtom = atom<Settings | null>(null);

export const AccentColorAtom = atom((get) => {
	const settings = get(SettingsAtom);
	return settings?.accentColor || "#1DB954"; // Fallback to default if not found
});
