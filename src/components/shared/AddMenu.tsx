import React, { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import {
	QueryClient,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { fetchWithAuth } from "@utils/fetchWithAuth";
import { authClient } from "@lib/auth-client";
import Fuse from "fuse.js";
import { useDismissOnClickOutside } from "@hooks/useDismissOnClickOutside";
import { ToastMessageAtom } from "@atoms/atoms";
import { useSetAtom } from "jotai";

interface IAddToPlaylist {
	setOpen: (value: boolean) => void;
	track_id: string;
	track_name: string;
}

interface ExtendedPlaylistMetadata extends PlaylistMetadata {
	has_track: boolean;
}

export default function AddToPlaylist(props: IAddToPlaylist) {
	const [search, setSearch] = useState("");
	const [isDirty, setIsDirty] = useState(false);
	const [didCancel, setDidCancel] = useState(false);
	const [playlistCheck, setPlaylistCheck] = useState<Map<string, boolean>>(
		new Map()
	);

	const divRef = useRef<HTMLDivElement | null>(null);
	const setToastMessage = useSetAtom(ToastMessageAtom);


	const user = authClient.useSession().data?.user;
	const { data: playlistsData, isSuccess } = useQuery({
		queryKey: ["userPlaylists", props.track_id],
		queryFn: () =>
			fetchWithAuth<ExtendedPlaylistMetadata[]>(
				`http://localhost:3000/api/v1/user/${user?.id}/playlists?track=${props.track_id}`
			),
		enabled: !!user,
	});
	const queryClient = useQueryClient();
	useDismissOnClickOutside(divRef, props.setOpen);

	function submit() {
		if (!playlistsData) return;
		if (didCancel) return;

		const body = {
			tracks: [props.track_id],
		};

		for (const [playlist, value] of playlistCheck) {
			if (!value) continue;

			const foundPlaylist = playlistsData.find(
				(element) => element.name === playlist
			);

			console.log(`Adding ${props.track_id} to ${foundPlaylist?.name}`);

			fetchWithAuth(
				`http://localhost:3000/api/v1/playlist/${foundPlaylist?.playlist_id}/tracks`,
				{ body: JSON.stringify(body), method: "POST" }
			);
		}

		queryClient.invalidateQueries();
		props.setOpen(false);
		
		if (playlistCheck.size === 1) {
			const playlist = playlistCheck.keys().next().value;

			const foundPlaylist = playlistsData.find(
				(element) => element.name === playlist
			);
			if (!foundPlaylist) return;

			const prefix = playlistCheck.get(playlist || "") ? "Added" : "Removed";
			const preposition = playlistCheck.get(playlist || "") ? "to" : "from";

			setToastMessage(`${prefix} ${props.track_name} ${preposition} ${foundPlaylist.name}`);
		} else if (playlistCheck.size > 1) {
			setToastMessage("Changes Saved");
		}
	}

	useEffect(() => {
		return () => {
			submit();
		};
	}, [didCancel, playlistsData]);

	// TODO FIX THIS.
	if (!isSuccess) return <></>;

	let filteredData = playlistsData.slice(0, 7);
	if (search !== "") {
		const fuse = new Fuse(playlistsData, {
			keys: ["name"],
			threshold: 0.3,
		});

		filteredData = fuse.search(search).map((result) => result.item);
	}

	return (
		<div
			data-ignore-click
			ref={divRef}
			className="absolute bottom-full right-20 bg-slate-800 shadow-2xl 
			min-h-72 w-72 rounded-md p-3 flex flex-col gap-3"
		>
			<span className="text-xs text-slate-300">Add to playlist</span>
			<div className="relative w-full">
				<div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
					<Icon type="search" />
				</div>
				<input
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					type="text"
					className="text-sm rounded-lg block w-full ps-10 p-2.5 outline-1 outline-slate-400
							bg-slate-700 placeholder-gray-400 text-white
							hover:border-none focus:outline-none focus:ring-0 active:outline-none"
				/>
			</div>
			<span className="p-2 hover:bg-slate-700 rounded-md">
				<Icon type="add" /> New Playlist
			</span>
			<hr className="border-t border-slate-500" />
			<ul className="overflow-scroll h-30">
				{filteredData.map((element) => (
					<label
						htmlFor={element.name}
						className="hover:bg-slate-700 rounded-md p-2 truncate flex flex-row items-center"
					>
						<p>{element.name}</p>
						<input
							id={element.name}
							className="ml-auto w-4 h-4 rounded-full overflow-clip
									bg-transparent appearance-none checked:outline-none
									outline outline-1 outline-slate-400 checked:bg-accent"
							type="checkbox"
							defaultChecked={element.has_track}
							onChange={(e) => {
								if (e.target.checked !== element.has_track)
									setIsDirty(true);

								if (e.target.checked) {
									setPlaylistCheck(
										playlistCheck.set(element.name, true)
									);
								} else {
									setPlaylistCheck(
										playlistCheck.set(element.name, false)
									);
								}
							}}
						/>
					</label>
				))}
			</ul>
			<hr className="border-t border-slate-500" />

			<div className="flex gap-2 ml-auto items-center">
				<span
					className="text-slate-300 hover:text-white p-1"
					onClick={() => {
						setDidCancel(true);
						props.setOpen(false);
					}}
				>
					Cancel
				</span>
				{isDirty && (
					<span
						onClick={() => props.setOpen(false)}
						className="bg-accent p-1 px-2 rounded-xl hover:scale-105 active:bg-accent-dark transition-transform duration-200 ease-in-out"
					>
						Done
					</span>
				)}
			</div>
		</div>
	);
}
