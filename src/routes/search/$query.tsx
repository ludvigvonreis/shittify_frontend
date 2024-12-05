import * as React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { secondsToClockFormat } from "@utils/time";
import { useAddToQueue, useSetQueue } from "@hooks/mediaHooks";
import { useAtom, useSetAtom } from "jotai";
import { TogglesAtom } from "@atoms/MediaPlayerAtoms";
import { SearchAtom } from "@components/search/SearchField";
import { usePageTitle } from "@hooks/usePageTitle";
import Icon from "@components/shared/Icon";
import { Messages } from "@utils/constants";
import { ToastMessageAtom } from "@atoms/atoms";
import Card from "@components/search/Card";
import { useEffect } from "react";
import { useSearchResults } from "@hooks/searchSortingHook";

export const Route = createFileRoute("/search/$query")({
	component: RouteComponent,
});

function RouteComponent() {
	const { query } = Route.useParams();
	const [search, setSearch] = useAtom(SearchAtom);
	usePageTitle("Shittify - Search");

	useEffect(() => {
		if (query !== search) {
			setSearch(query);
		}

		return () => {
			setSearch("");
		};
	}, []);

	let { data, isError, mostRelevant } = useSearchResults(query);

	const setQueue = useSetQueue();
	const addToQueue = useAddToQueue();
	const setMediaToggles = useSetAtom(TogglesAtom);
	const setToastMessage = useSetAtom(ToastMessageAtom);
	const navigate = useNavigate();

	if (isError) return <></>;
	if (!data) return <></>;
	if (data.tracks.length < 1) return <>Nothing Found</>;

	if (!mostRelevant) mostRelevant = data.tracks[0];

	return (
		<main className="pb-24">
			<div className="flex flex-row p-5 gap-5 select-none">
				<MostRelevant data={mostRelevant} />
				<ul className="flex flex-col w-2/3">
					{data.tracks.slice(0, 4).map((element) => {
						return (
							<li
								key={element.track_id}
								className="hover:bg-slate-800 rounded-md h-16 flex flex-row 
						items-center gap-3 p-1 w-ful transition-colors"
								onDoubleClick={() => {
									setQueue([
										{
											...element,
											image: element.album_image,
										},
									]);
									setMediaToggles((toggles) => {
										return { ...toggles, isPlaying: true };
									});
								}}
							>
								<img
									src={element.album_image}
									alt={`${element.album_image} image`}
									className="p-1 rounded-lg h-full aspect-square"
								/>
								<div>
									<h1 className="text-lg truncate hover:underline">
										<Link>{element.name}</Link>
									</h1>
									<p className="text-sm font-light text-slate-400 hover:underline">
										<Link>{element.artist}</Link>
									</p>
								</div>
								<button
									title="Add to Queue"
									className="justify-self-center cursor-pointer ml-auto
								text-slate-300 hover:text-inherit"
									onClick={() => {
										if (
											addToQueue({
												...element,
												image: element.album_image,
											})
										) {
											setToastMessage(
												Messages.addToQueueMessage
											);
										}
									}}
								>
									<Icon type={"queue_music"} />
								</button>
								<p className="text-base pr-4 w-16 text-right">
									{secondsToClockFormat(element.duration)}
								</p>
							</li>
						);
					})}
				</ul>
			</div>
			<SearchRow title={<h2>Albums</h2>}>
				{data.albums.slice(0, 7).map((element) => (
					<Card
						key={element.album_id}
						className={"min-w-[14.2857%]"} // 1 / 7 to 4 dec precision
						onDoubleClick={() =>
							navigate({
								to: "/album/$albumid",
								params: { albumid: element.album_id },
							})
						}
						type={"Album"}
						image={element.image}
						header={
							<Link
								to="/album/$albumid"
								params={{ albumid: element.album_id }}
							>
								{element.album_name}
							</Link>
						}
						subHeader={
							<>
								{new Date(element.release_date).getFullYear()}{" "}
								{" • "}
								<Link className="hover:underline ">
									{element.artist}
								</Link>
							</>
						}
					/>
				))}
			</SearchRow>
			<SearchRow title={<h2>Artists</h2>}>
				{data.artists.slice(0, 7).map((element) => (
					<Card
						key={element.artist_id}
						className={"min-w-[14.2857%]"} // 1 / 7 to 4 dec precision
						type={"Artist"}
						image={element.image}
						header={<Link>{element.name}</Link>}
						subHeader={"Artist"}
					/>
				))}
			</SearchRow>
		</main>
	);
}

interface SearchRowProps {
	children: React.ReactNode[] | React.ReactNode;
	title: React.ReactNode;
}

interface MostRelevantProps {
	data: SearchAlbum | SearchTrack | SearchArtist;
}

export function SearchRow(props: SearchRowProps) {
	return (
		<section className="h-max w-full select-none">
			<div className="px-7 text-2xl font-bold">{props.title}</div>
			<div className="h-72 w-full overflow-x-scroll flex items-center p-2">
				{props.children}
			</div>
		</section>
	);
}

function MostRelevant({ data }: MostRelevantProps) {
	const renderContent = (
		image: string,
		name: string,
		type: "Album" | "Artist" | "Track",
		artist: string
	) => (
		<div
			className="flex bg-slate-800/50 w-1/3 h-64 rounded-md p-6 
					flex-col hover:bg-slate-800 transition-colors duration-300"
		>
			<img
				// Make artist image a circle
				className={`w-32 h-32 ${type !== "Artist" ? "rounded-md" : "rounded-full"}`} 
				src={image}
				alt={`image of ${name}`}
			/>
			<Link className="text-3xl pt-2 truncate hover:underline">
				{name}
			</Link>
			<p className="text-slate-400">
				<span className="font-light">{type}</span>{" "}
				{type !== "Artist" && " • "}{" "}
				{type !== "Artist" && <Link>{artist}</Link>}
			</p>
		</div>
	);

	// Type guards for identifying the specific type and rendering accordingly
	if ("track_id" in data) {
		// SearchTrack
		return renderContent(data.album_image, data.name, "Track", data.artist);
	}

	if ("album_id" in data) {
		// SearchAlbum
		return renderContent(data.image, data.album_name, "Album", data.artist);
	}

	if ("artist_id" in data) {
		// SearchArtist
		return renderContent(data.image, data.name, "Artist", data.name);
	}

	return null; // In case no type matches, return nothing
}
