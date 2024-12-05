import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { usePageTitle } from "@hooks/usePageTitle";
import AudioVizualizer from "@components/filters/AudioVizualizer";
import { SearchRow } from "./search/$query";
import Card from "@components/search/Card";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@utils/fetchWithAuth";
import { authClient } from "@lib/auth-client";
import Icon from "@components/shared/Icon";

export const Route = createFileRoute("/")({
	component: HomeComponent,
});

function HomeComponent() {
	usePageTitle("Shitifiy");
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const user = authClient.useSession().data?.user;
	const { data, isSuccess } = useQuery({
		queryKey: ["userPlaylists"],
		queryFn: () =>
			fetchWithAuth<PlaylistMetadata[]>(
				`http://localhost:3000/api/v1/user/${user?.id}/playlists`
			),
		enabled: !!user,
	});

	const mutation = useMutation({
		mutationKey: ["createPlaylist"],
		mutationFn: () =>
			fetchWithAuth("http://localhost:3000/api/v1/playlist/new", {
				method: "POST",
			}),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["userPlaylists"] });
			navigate({
				to: "/playlist/$playlistid",
				params: { playlistid: data.playlist_id },
			});
		},
	});

	if (!isSuccess) return <></>;

	return (
		<div className="p-2">
			<SearchRow
				title={
					<div className="flex gap-5 w-full">
						<h2 className="font-normal">Your Playlists</h2>
						<button
							className="ml-auto"
							onClick={() => mutation.mutate()}
						>
							<h2 className="font-bold align-top text-slate-300 text-lg
								hover:text-inherit bg-slate-700 rounded-xl py-2 px-4">
								Create New Playlist
							</h2>
						</button>
					</div>
				}
			>
				{data.slice(0, 7).map((element) => (
					<Card
						key={element.playlist_id}
						type={"Playlist"}
						header={
							<Link
								to="/playlist/$playlistid"
								params={{ playlistid: element.playlist_id }}
							>
								{element.name}
							</Link>
						}
						subHeader={element.description}
						image={element.image}
						className={"min-w-[14.2857%]"} // 1 / 7 to 4 dec precision
						onDoubleClick={() =>
							navigate({
								to: "/playlist/$playlistid",
								params: { playlistid: element.playlist_id },
							})
						}
					/>
				))}
			</SearchRow>
			<AudioVizualizer className={"w-full h-64 rounded-lg mx-auto"} />
		</div>
	);
}
