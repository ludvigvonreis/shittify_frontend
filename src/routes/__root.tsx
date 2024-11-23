import { Outlet, createRootRoute, useNavigate } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import MediaPlayer from "@components/mediaPlayer/MediaPlayer";
import SearchField from "@components/search/SearchField";
import { useAtomValue } from "jotai";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

export const Route = createRootRoute({
	component: RootComponent,
});

const queryClient = new QueryClient();

function RootComponent() {
	return (
		<>
			<nav className="w-full h-16 grid grid-cols-3 grid-rows-1 "> 
				<div className="justify-start"></div>
				<SearchField />
				<div className="justify-end"></div>
			</nav>
			<QueryClientProvider client={queryClient}>
				<Outlet />
			</QueryClientProvider>
			<MediaPlayer />
			<TanStackRouterDevtools position="top-right" />
		</>
	);
}
