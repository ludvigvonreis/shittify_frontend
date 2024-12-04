import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { secondsToReadable } from "@utils/time";
import Icon from "@components/shared/Icon";
import { useAddToQueue, useSetQueue } from "@hooks/mediaHooks";
import {
	CurrentTrackAtom,
	MediaAtom,
	TogglesAtom,
} from "@atoms/MediaPlayerAtoms";
import { useAtomValue, useSetAtom } from "jotai";
import { ToastMessageAtom } from "@atoms/atoms";
import { Messages } from "@utils/constants";
import { usePageTitle } from "@hooks/usePageTitle";
import { fetchWithAuth } from "@utils/fetchWithAuth";
import TrackTable, { TrackListItem } from "@components/overview/TrackTable";

export const Route = createFileRoute("/album/$albumid")({
	component: RouteComponent,
});

function RouteComponent() {
	const { albumid } = Route.useParams();

	const { data, isSuccess } = useSuspenseQuery({
		queryKey: ["album", albumid],
		queryFn: () =>
			fetchWithAuth<Album>(
				`http://localhost:3000/api/v1/album/${albumid}`
			),
	});

	if (!isSuccess) return <>ERROR</>;

	usePageTitle(`${data.title} - ${data.artist}`);

	const setQueue = useSetQueue();
	const addQueue = useAddToQueue();
	const currentTrack = useAtomValue(CurrentTrackAtom);
	const setToastMessage = useSetAtom(ToastMessageAtom);
	const mediaToggles = useAtomValue(TogglesAtom);

	data.length = data.contents.reduce((accumulator: number, currentValue) => {
		return accumulator + currentValue.duration;
	}, 0);

	const tableBody = data.contents.map((element, index) => (
		<TrackListItem
			key={element.track_id}
			element={element}
			currentTrack={mediaToggles.isPlaying ? currentTrack : null}
			onDoubleClick={() => setQueue([element], true)}
			onQueueClick={() => {
				if (addQueue(element))
					setToastMessage(Messages.addToQueueMessage);
			}}
		/>
	));

	return (
		<main className="pb-24">
			<header className="h-max w-full flex flex-row p-5 gap-5">
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
			</header>
			<Icon
				type="play_circle"
				className="pl-8 text-[4rem] text-accent"
				onClick={() => setQueue(data.contents, true)}
			/>
			<TrackTable>{tableBody}</TrackTable>
		</main>
	);
}
