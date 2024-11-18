import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/search/$query")({
	component: RouteComponent,
});

async function getSearchResults(query: string) {
	try {
		const response = await fetch(`http://localhost:3000/v1/search/${query}`);
		const data = await response.json() as SearchResults[];

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

	return `Hello /search/${query}!`;
}
