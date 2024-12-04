import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "@utils/fetchWithAuth";
import {
	CurrentTrackAtom,
	MediaAtom,
	TogglesAtom,
} from "@atoms/MediaPlayerAtoms";
import { useAtomValue, useSetAtom } from "jotai";
import Icon from "@components/shared/Icon";
import { twMerge } from "tailwind-merge";
import { formatDate, secondsToClockFormat, secondsToReadable } from "@utils/time";
import { ToastMessageAtom } from "@atoms/atoms";
import { useSetQueue, useAddToQueue } from "@hooks/mediaHooks";
import TrackTable, { TrackListItem } from "@components/overview/TrackTable";
import { Messages } from "@utils/constants";
import { useMemo } from "react";

interface User {
	name: string;
	id: string;
	image: string;
}

export const Route = createFileRoute("/playlist/$playlistid")({
	component: RouteComponent,
});

function RouteComponent() {
	const { playlistid } = Route.useParams();
	const { data: playlistMetadata, error } = useSuspenseQuery({
		queryKey: ["playlistMetadata∏", playlistid],
		queryFn: () =>
			fetchWithAuth<PlaylistMetadata>(
				`http://localhost:3000/api/v1/playlist/${playlistid}`
			),
	});
	const { data: userData } = useSuspenseQuery({
		queryKey: ["playlistUser", playlistMetadata.user_id],
		queryFn: () =>
			fetchWithAuth<User>(
				`http://localhost:3000/api/v1/user/${playlistMetadata.user_id}`
			),
	});
	const { data: playlistTracks } = useSuspenseQuery({
		queryKey: ["playlistTracks", playlistMetadata.playlist_id],
		queryFn: () =>
			fetchWithAuth<Track[]>(
				`http://localhost:3000/api/v1/playlist/${playlistid}/tracks`
			),
	});

	const totalTime = useMemo(() => playlistTracks.reduce((prev, acc) => {
		return prev + acc.duration;
	}, 0), [playlistTracks.length]);

	const setQueue = useSetQueue();
	const addQueue = useAddToQueue();
	const currentTrack = useAtomValue(CurrentTrackAtom);
	const mediaToggles = useAtomValue(TogglesAtom);
	const setToastMessage = useSetAtom(ToastMessageAtom);

	if (!playlistTracks) return <></>;

	const tableBody = playlistTracks.map((element, index) => (
		<TrackListItem
			key={element.track_id + index}
			element={element}
			includeAlbum
			includeDate
			currentTrack={mediaToggles.isPlaying ? currentTrack : null}
			date={new Date()}
			onDoubleClick={() => setQueue([element], true)}
			onQueueClick={() => {
				if (addQueue(element))
					setToastMessage(Messages.addToQueueMessage);
			}}
		/>
	));

	return (
		<main className="pb-24 select-none">
			<header className="h-max w-full flex flex-row p-5 gap-5">
				<img
					src={playlistMetadata.image}
					alt=""
					className="w-64 h-64 
	  rounded-md hover:scale-105 transition-transform"
				/>
				<div className="flex flex-col justify-center">
					<p className="text-sm font-light">Playlist</p>
					<h1 className="text-[7rem] font-bold">
						{playlistMetadata.name}
					</h1>
					<p className="font-thin text-md">
						{playlistMetadata.description}
					</p>
					<p>
						{userData.name}
						<span className="font-extralight text-slate-400">
							{" • "}
							{`${playlistTracks.length} song${playlistTracks.length >= 2 ? "s": ""}`}
							{" • "}
							{secondsToReadable(totalTime)}
						</span>
					</p>
				</div>
			</header>
			<TrackTable includeAlbum includeDate>
				{tableBody}
			</TrackTable>
		</main>
	);
}
