import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { usePageTitle } from "@hooks/usePageTitle";
import AudioVizualizer from "@components/filters/AudioVizualizer";

export const Route = createFileRoute("/")({
	component: HomeComponent,
});

function HomeComponent() {
	usePageTitle("Shitifiy");

	return (
		<div className="p-2">
			<h3>Welcome Home!</h3>
			<AudioVizualizer className={"w-1/2 h-64 rounded-lg mx-auto"} />
		</div>
	);
}
