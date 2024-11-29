import * as React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
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

export const Route = createFileRoute("/search/$query")({
	component: RouteComponent,
});

async function getSearchResults(query: string) {
	try {
		const response = await fetch(
			`http://localhost:3000/v1/search/${query}`
		);
		const data = (await response.json()) as SearchResults;

		return data;
	} catch (e) {
		throw new Error("Uh Oh!");
	}
}

function RouteComponent() {
	const { query } = Route.useParams();
	const [search, setSearch] = useAtom(SearchAtom);
	usePageTitle("Shittify - Search");

	if (query !== search) {
		setSearch(query);
	}

	useEffect(()=> {
		return () => {
			setSearch("");
		}
	}, []);

	const { data, isSuccess } = useQuery({
		queryKey: ["search", query],
		queryFn: () => getSearchResults(query),
		placeholderData: keepPreviousData,
	});

	const setQueue = useSetQueue();
	const addToQueue = useAddToQueue();
	const setMediaToggles = useSetAtom(TogglesAtom);
	const setToastMessage = useSetAtom(ToastMessageAtom);
	const navigate = useNavigate();

	if (!isSuccess) return <></>;
	if (data.tracks.length < 1) return <>Nothing Found</>;

	return (
		<main className="pb-24">
			<div className="flex flex-row p-5 gap-5 select-none">
				<div
					className="flex bg-slate-800 w-1/3 h-64 rounded-md p-6 
					flex-col hover:bg-slate-700 transition-colors"
				>
					<img
						className="w-32 h-32 rounded-md"
						src={data.tracks[0].album_image}
						alt={`image of ${data.tracks[0].album_image}`}
					/>
					<Link className="text-3xl pt-2 truncate hover:underline">
						{data.tracks[0].name}
					</Link>
					<p className="text-slate-400">
						<span className="font-light">{"Track"}</span>
						{" • "}
						<Link className="hover:underline">{data.tracks[0].artist}</Link>
					</p>
				</div>
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
			<SearchRow title={"Albums"}>
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
			<SearchRow title={"Artists"}>
				{data.artists.slice(0, 7).map((element) => (
					<Card
						key={element.artist_id}
						className={"min-w-[14.2857%]"} // 1 / 7 to 4 dec precision
						type={"Artist"}
						image={element.image}
						header={
							<Link>
								{element.name}
							</Link>
						}
						subHeader={"Artist"}
					/>
				))}
			</SearchRow>
		</main>
	);
}

interface SearchRowProps {
	children: React.ReactNode[] | React.ReactNode;
	title: string;
}

function SearchRow(props: SearchRowProps) {
	return (
		<section className="h-max w-full select-none">
			<h2 className="px-7 text-2xl font-bold">{props.title}</h2>
			<div className="h-72 w-full overflow-x-scroll flex items-center p-2">
				{props.children}
			</div>
		</section>
	);
}
