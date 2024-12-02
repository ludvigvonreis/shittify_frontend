import { Link, Outlet, createRootRoute, useLocation } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import MediaPlayer from "@components/mediaPlayer/MediaPlayer";
import SearchField from "@components/search/SearchField";
import { QueryClientProvider, QueryClient, useQuery } from "@tanstack/react-query";
import Icon from "@components/shared/Icon";
import { useEffect } from "react";
import { Provider, useAtom, useAtomValue } from "jotai";
import ProfileWrapper from "@components/auth/ProfileWrapper";
import { SettingsAtom } from "@atoms/atoms";
import { fetchWithAuth } from "@utils/fetchWithAuth";

export const Route = createRootRoute({
	component: RootComponent,
});

const queryClient = new QueryClient();

function RootComponent() {
	const settings = useAtomValue(SettingsAtom);

	useEffect(() => {
		if (!settings) return;

		document.documentElement.style.setProperty(
			"--accent-color",
			settings.accentColor
		);
	}, [settings]);

	// HACK: Biggest hack ever, prevents stuff from loading in this ROOT component when login is visible.
	// Both to prevent unused rendering time but also to prevent music and interaction from happening in the login route
	const location = useLocation();
	if (location.href.includes("login")) return <Outlet />;

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
				<SettingsProvider />
				<Outlet />
			</QueryClientProvider>
			<MediaPlayer />
		</>
	);
}

function SettingsProvider() {
	const { data } = useQuery({
		queryKey: ["settings"],
		queryFn: () =>
			fetchWithAuth<Settings>("http://localhost:3000/api/v1/settings"),
		staleTime: 0,
	});
	const [settings, setSettings] = useAtom(SettingsAtom);

	useEffect(() => {
		if (!data) return;

		setSettings(data);
	}, [settings, data, setSettings])

	return <></>;
}

// <TanStackRouterDevtools position="top-right" />
