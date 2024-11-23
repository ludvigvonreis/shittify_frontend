import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { secondsToClockFormat, secondsToReadable } from "@utils/time";
import Icon from "@components/shared/Icon";
import { useAddToQueue, useSetQueue } from "@hooks/mediaHooks";
import {
	AccentColorAtom,
	CurrentTrackAtom,
	MediaAtom,
} from "@atoms/MediaPlayerAtoms";
import { useAtomValue } from "jotai";
import { twMerge } from "tailwind-merge";
import TrackListItem from "@components/overview/TrackListItem";

export const Route = createFileRoute("/album/$albumid")({
	component: RouteComponent,
});

async function fetchAlbum(albumId: string): Promise<Album> {
	const response = await fetch(`http://localhost:3000/v1/album/${albumId}`);
	const value = await response.json();
	return value;
}

function RouteComponent() {
	const { albumid } = Route.useParams();

	const { data, isSuccess } = useSuspenseQuery({
		queryKey: ["album", albumid],
		queryFn: () => fetchAlbum(albumid),
	});

	if (!isSuccess) return <>ERROR</>;

	const setQueue = useSetQueue();
	const addQueue = useAddToQueue();
	const accentColor = useAtomValue(AccentColorAtom);
	const currentTrack = useAtomValue(CurrentTrackAtom);
	const mediaAtom = useAtomValue(MediaAtom);

	data.length = data.contents.reduce((accumulator, currentValue) => {
		return accumulator + currentValue.duration;
	}, 0);

	const tableBody = data.contents.map((element, index) => (
		<TrackListItem
			element={element}
			queue={mediaAtom.queue}
			currentTrack={currentTrack}
			index={index}
			onDoubleClick={() => setQueue([element], true)}
			addToQueue={() => addQueue(element)}
		/>
	));

	return (
		<main className="pb-24">
			<div className="h-max w-full flex flex-row p-5 gap-5">
				<img
					src={data.albumCoverSrc}
					alt=""
					className="w-64 h-64 
					rounded-md hover:scale-105 transition-transform"
				/>
				<div className="flex flex-col justify-center">
					<p className="text-sm font-light">Album</p>
					<h1 className="text-[7rem] font-bold">{data.title}</h1>
					<p>
						{data.artist}
						<span className="font-extralight text-slate-400">
							{" • "}
							{new Date(data.releaseDate).getFullYear()}
							{" • "}
							{`${data.contents.length} songs`}
							{", "}
							{secondsToReadable(data.length)}
						</span>
					</p>
				</div>
			</div>
			<Icon
				type="play_circle"
				className={twMerge("pl-8 text-[4rem]", accentColor.text)}
				onClick={() => setQueue(data.contents, true)}
			/>
			<div className="text-white p-4 rounded-lg">
				{/* Header */}
				<div
					className="grid grid-cols-[50px_1fr_2rem_3rem] 
					text-slate-400 text-sm pb-2 border-b border-slate-700"
				>
					<div className="text-center ml-3">#</div>
					<div>Title</div>
					<div></div>
					<div className="text-right">
						<Icon type="schedule" className="mr-2" />
					</div>
				</div>

				{/* Track Rows */}
				<div className="space-y-3 mt-3">{tableBody}</div>
			</div>
		</main>
	);
}
