import {
	Link,
	Outlet,
	createRootRoute,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import MediaPlayer from "@components/mediaPlayer/MediaPlayer";
import SearchField from "@components/search/SearchField";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import Icon from "@components/shared/Icon";

export const Route = createRootRoute({
	component: RootComponent,
});

const queryClient = new QueryClient();

function RootComponent() {
	return (
		<>
			<nav className="w-full h-16 grid grid-cols-3 grid-rows-1">
				<Link to="/" className="justify-start px-5 flex items-center">
					<Icon
						type="music_note"
						className="text-[3rem] text-slate-200 hover:text-inherit transition-colors"
					/>
				</Link>
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
