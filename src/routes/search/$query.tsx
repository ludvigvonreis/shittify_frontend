import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { secondsToClockFormat } from "@utils/time";
import { useSetQueue } from "@hooks/mediaHooks";
import { useAtom, useSetAtom } from "jotai";
import { TogglesAtom } from "@atoms/MediaPlayerAtoms";
import { SearchAtom } from "@components/search/SearchField";

export const Route = createFileRoute("/search/$query")({
	component: RouteComponent,
});

async function getSearchResults(query: string) {
	try {
		const response = await fetch(
			`http://localhost:3000/v1/search/${query}`
		);
		const data = (await response.json()) as SearchResults[];

		return data;
	} catch (e) {
		throw new Error("Uhh hawk tuah");
	}
}

function RouteComponent() {
	const { query } = Route.useParams();
	const [search, setSearch] = useAtom(SearchAtom);

	if (query !== search) {
		setSearch(query);
	}

	const { data, isSuccess } = useSuspenseQuery({
		queryKey: ["search", query],
		queryFn: () => getSearchResults(query),
	});

	const setQueue = useSetQueue();
	const setMediaToggles = useSetAtom(TogglesAtom);

	if (!isSuccess) return <>Hawk tuh uh</>;
	if (data.length < 1) return <>Melker</>;

	return (
		<>
			<div className="flex flex-row p-5 gap-5 select-none">
				<div className="flex bg-slate-800 w-1/3 h-64 rounded-md p-6 flex-col hover:bg-slate-700 transition-colors">
					<img
						className="w-32 h-32"
						src={data[0].album_image}
						alt="image of {data[0].album_image}"
					/>
					<h2 className="text-3xl pt-2 truncate">
						{data[0].track_name}
					</h2>
					<p className="text-slate-400"><span className="font-light">{"Track"}</span>{" • "}{data[0].artist_name}</p>
				</div>
				<ul className="flex flex-col w-2/3">
					{data.slice(0, 4).map((element) => {
						return (
							<li
								className="hover:bg-slate-800 rounded-md h-16 flex flex-row 
								items-center gap-3 p-1 w-ful transition-colors"
								onDoubleClick={() => {
									setQueue(
										[{
											...element,
											artist: element.album_name,
											album: element.album_name,
											name: element.track_name,
											duration: element.track_duration,
											index: element.track_index,
											path: element.track_path,
											image: element.album_image,
										}]
									);
									setMediaToggles((toggles) => {
										return { ...toggles, isPlaying: true };
									});
								}}
							>
								<img
									src={element.album_image}
									alt={`${element.album_name} image`}
									className="p-1 rounded-lg h-full aspect-square"
								/>
								<div>
									<h1 className={"text-lg truncate"}>
										{element.track_name}
									</h1>
									<p className="text-sm font-light text-slate-400">
										{element.artist_name}
									</p>
								</div>
								<p className="text-base ml-auto pr-4">
									{secondsToClockFormat(
										element.track_duration
									)}
								</p>
							</li>
						);
					})}
				</ul>
			</div>
		</>
	);
}
