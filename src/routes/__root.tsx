import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import MediaPlayer from "@components/mediaPlayer/MediaPlayer";
import SearchField from "@components/search/SearchField";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import Icon from "@components/shared/Icon";
import { useEffect } from "react";
import { useAtomValue } from "jotai";
import { AccentColorAtom } from "@atoms/MediaPlayerAtoms";
import ProfileWrapper from "@components/auth/ProfileWrapper";

export const Route = createRootRoute({
	component: RootComponent,
});

const queryClient = new QueryClient();

function RootComponent() {
	const accentColor = useAtomValue(AccentColorAtom);


	useEffect(() => {
		document.documentElement.style.setProperty(
			"--accent-color",
			accentColor
		);
	}, [accentColor]);

	return (
		<>
			<nav className="w-full h-20 grid grid-cols-3 grid-rows-1 p-2">
				<Link to="/" className="justify-start px-5 flex items-center">
				<Icon
					type="graphic_eq"
					className="text-[3rem] text-slate-200 hover:text-inherit transition-colorshover:text-inherit transition-colors"
				/>
				</Link>
				<SearchField />
				<div className="justify-end">
					<ProfileWrapper />
				</div>
			</nav>
			<QueryClientProvider client={queryClient}>
				<Outlet />
			</QueryClientProvider>
			<MediaPlayer />

		</>
	);
}

// <TanStackRouterDevtools position="top-right" />
