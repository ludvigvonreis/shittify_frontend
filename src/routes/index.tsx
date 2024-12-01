import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { usePageTitle } from "@hooks/usePageTitle";
import AudioVizualizer from "@components/filters/AudioVizualizer";
import { authClient } from "@lib/auth-client";

export const Route = createFileRoute("/")({
	component: HomeComponent,
});

function HomeComponent() {
	usePageTitle("Shitifiy");

	async function handleSignOut() {
		await authClient.signOut()
	}

	return (
		<div className="p-2">
			<AudioVizualizer className={"w-full h-64 rounded-lg mx-auto"} />

			<button onClick={handleSignOut} className="bg-slate-800 p-4 rounded-md">Sign out</button>
		</div>
	);
}
