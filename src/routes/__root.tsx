import { Outlet, createRootRoute, useNavigate } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import MediaPlayer from "@components/mediaPlayer/MediaPlayer";
import SearchField from "@components/search/SearchField";
import { useAtomValue } from "jotai";

export const Route = createRootRoute({
	component: RootComponent,
});

function RootComponent() {
	return (
		<>
			<div className="w-full h-16 grid grid-cols-3 grid-rows-1 bg-slate-800">
				<div className="justify-start"></div>
				<SearchField />
				<div className="justify-end"></div>
			</div>
			<Outlet />
			<MediaPlayer />
			<TanStackRouterDevtools position="top-right" />
		</>
	);
}
