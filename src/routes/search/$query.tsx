import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { secondsToClockFormat } from "@utils/time";

export const Route = createFileRoute("/search/$query")({
	component: RouteComponent,
});

async function getSearchResults(query: string) {
	try {
		const response = await fetch(
			`http://192.168.198.128:3000/v1/search/${query}`
		);
		const data = (await response.json()) as SearchResults[];

		return data;
	} catch (e) {
		throw new Error("Uhh hawk tuah");
	}
}

function RouteComponent() {
	const { query } = Route.useParams();
	const { data, isSuccess } = useSuspenseQuery({
		queryKey: ["search", query],
		queryFn: () => getSearchResults(query),
	});

	if (!isSuccess) return <>Hawk tuh uh</>;
	if (data.length < 1) return <>Melker</>;

	return (
		<>
			<div className="flex flex-row p-5 gap-5">
				<div className="flex bg-slate-800 w-1/3 h-64 rounded-md p-6 flex-col hover:bg-slate-600 transition-colors">
					<img
						className="w-32 h-32"
						src={data[0].album_image}
						alt="image of {data[0].album_image}"
					/>
					<h2 className="text-3xl pt-2 truncate">
						{data[0].track_name}
					</h2>
					<p className="opacity-50">{data[0].artist_name}</p>
				</div>
				<ul className="flex flex-col justify-evenly w-2/3">
					{data.slice(0, 4).map((element) => {
						return (
							<li className="bg-slate-800 rounded-md h-16 flex flex-row items-center gap-3 p-1 w-full hover:bg-slate-600 transition-colors">
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
								<p className="text-sm ml-auto pr-4">
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
