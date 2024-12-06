import { createFileRoute } from "@tanstack/react-router";
import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { fetchWithAuth } from "@utils/fetchWithAuth";
import { CurrentTrackAtom, TogglesAtom } from "@atoms/MediaPlayerAtoms";
import { useAtomValue, useSetAtom } from "jotai";
import { secondsToReadable } from "@utils/time";
import { ToastMessageAtom } from "@atoms/atoms";
import { useSetQueue, useAddToQueue } from "@hooks/mediaHooks";
import TrackTable, { TrackListItem } from "@components/overview/TrackTable";
import { Messages } from "@utils/constants";
import {
	ChangeEvent,
	FormEvent,
	useMemo,
	useRef,
	useState,
} from "react";
import { usePageTitle } from "@hooks/usePageTitle";
import Icon from "@components/shared/Icon";
import { Input } from "@components/shared/Input";

interface User {
	name: string;
	id: string;
	image: string;
}

interface PlaylistTrack extends Track {
	dateAdded: Date;
}

export const Route = createFileRoute("/playlist/$playlistid")({
	component: RouteComponent,
});

function RouteComponent() {
	const { playlistid } = Route.useParams();
	const { data: playlistMetadata, error } = useSuspenseQuery({
		queryKey: ["playlistMetadata", playlistid],
		queryFn: () =>
			fetchWithAuth<PlaylistMetadata>(
				`http://localhost:3000/api/v1/playlist/${playlistid}`
			),
	});
	const { data: userData } = useSuspenseQuery({
		queryKey: ["playlistUser", playlistMetadata.user_id],
		queryFn: () =>
			fetchWithAuth<User>(
				`http://localhost:3000/api/v1/user/${playlistMetadata.user_id}`
			),
	});
	const { data: playlistTracks } = useSuspenseQuery({
		queryKey: ["playlistTracks", playlistMetadata.playlist_id],
		queryFn: () =>
			fetchWithAuth<PlaylistTrack[]>(
				`http://localhost:3000/api/v1/playlist/${playlistid}/tracks`
			),
	});

	const totalTime = useMemo(
		() =>
			playlistTracks.reduce((prev, acc) => {
				return prev + acc.duration;
			}, 0),
		[playlistTracks.length]
	);

	usePageTitle(
		`${playlistMetadata.name} - playlist by ${userData.name} | Shitify`
	);
	const setQueue = useSetQueue();
	const addQueue = useAddToQueue();
	const currentTrack = useAtomValue(CurrentTrackAtom);
	const mediaToggles = useAtomValue(TogglesAtom);
	const setToastMessage = useSetAtom(ToastMessageAtom);

	const [editModalActive, setEditModalActive] = useState(false);

	if (!playlistTracks) return <></>;

	const tableBody = playlistTracks.map((element, index) => (
		<TrackListItem
			key={element.track_id + index}
			element={element}
			includeAlbum
			includeDate
			currentTrack={mediaToggles.isPlaying ? currentTrack : null}
			date={new Date(element.dateAdded)}
			onDoubleClick={() => setQueue([element], true)}
			onQueueClick={() => {
				if (addQueue(element))
					setToastMessage(Messages.addToQueueMessage);
			}}
		/>
	));

	return (
		<main className="pb-24 select-none">
			{editModalActive && (
				<EditModal
					playlistId={playlistMetadata.playlist_id}
					name={playlistMetadata.name}
					public={playlistMetadata.public}
					description={playlistMetadata.description}
					image={playlistMetadata.image}
					onClose={() => {
						setEditModalActive(false);
					}}
				/>
			)}
			<header className="h-max w-full flex flex-row p-5 gap-5">
				<img
					src={playlistMetadata.image}
					alt=""
					className="w-64 h-64 
	  				rounded-md hover:scale-105 transition-transform object-cover"
					onClick={() => setEditModalActive(true)}
				/>
				<div className="flex flex-col justify-center truncate">
					<p className="text-md">Playlist</p>
					<h1
						className="text-[7rem] font-bold truncate"
						onClick={() => setEditModalActive(true)}
					>
						{playlistMetadata.name}
					</h1>
					<p className="text-md w-max">
						{playlistMetadata.description}
					</p>
					<span className="w-max">
						<span className="hover:underline w-max">
							{userData.name}
						</span>
						{playlistTracks.length > 0 && (
							<span className="font-extralight text-slate-400">
								{" • "}
								{`${playlistTracks.length} song${playlistTracks.length >= 2 ? "s" : ""}`}
								{" • "}
								{secondsToReadable(totalTime)}
							</span>
						)}
					</span>
				</div>
			</header>
			{playlistTracks.length > 0 && (
				<Icon
					type="play_circle"
					className="pl-8 text-[4rem] text-accent"
					onClick={() => setQueue(playlistTracks, true)}
				/>
			)}
			{playlistTracks.length > 0 && (
				<TrackTable includeAlbum includeDate>
					{tableBody}
				</TrackTable>
			)}
		</main>
	);
}

interface IEditModal {
	name: string;
	description: string;
	image: string;
	public: boolean;
	playlistId: string;
	onClose?: () => void;
}

function EditModal(props: IEditModal) {
	const fileRef = useRef<HTMLInputElement | null>(null);
	const [isDirty, setIsDirty] = useState(false);
	const queryClient = useQueryClient();

	const [name, setName] = useState(props.name);
	const [description, setDescription] = useState(props.description);
	const [image, setImage] = useState(props.image);
	const [isPublic, setIsPublic] = useState(props.public);
	const [toastMessage, setToastMessage] = useState("");

	const mutation = useMutation({
		mutationKey: ["updatePlaylist", props.playlistId],
		mutationFn: (body: FormData) =>
			fetchWithAuth(
				`http://localhost:3000/api/v1/playlist/${props.playlistId}/update`,
				{ body: body, method: "POST" },
				false
			),
		onSuccess: () => {
			queryClient.invalidateQueries();
		},
	});

	function onFileChange(e: ChangeEvent<HTMLInputElement>) {
		const files = e.target.files;
		const image = files ? files[0] : "";

		// Check if a file was selected
		if (image) {
			const reader = new FileReader();

			// Once the file is loaded, set it as the image source
			reader.onload = function (e) {
				setImage(e.target?.result as string);
			};

			// Read the file as a data URL
			reader.readAsDataURL(image);
		}
	}

	async function onSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const originalData = {
			name: props.name,
			description: props.description,
			image: props.image, // Image will need some different logic
			public: props.public,
		};

		const formData = new FormData(e.currentTarget);
		const newFormData = {} as FormData;

		// Loop through FormData entries
		formData.forEach((value, key) => {
			// Check if the value has changed by comparing it with the original data

			if (key === "image") {
				if (image !== originalData.image) {
					// @ts-ignore
					newFormData[key] = value;
				}
			} else {
				// @ts-ignore
				if (originalData[key] !== value) {
					// @ts-ignore
					newFormData[key] = value;
				}
			}
		});

		setIsDirty(false);
		mutation.mutate(formData);
		if (props.onClose) {
			props.onClose();
		}
	}

	function handleClose() {
		if (isDirty === false && props.onClose) {
			props.onClose();
		}
		if (isDirty) {
			setToastMessage("Please save your changes before exiting.");
			setIsDirty(false); // allow user to exit anyways.
		}
	}

	return (
		<div
			className="absolute top-0 left-0 w-screen h-screen
		bg-black/60 z-50 flex items-center justify-center"
			onClick={(e) => {
				const target = e.target as HTMLElement;
				// Ignore invalid closing elements.
				if (target.closest("[data-ignore-click]")) {
					e.stopPropagation();
					return;
				}
				handleClose();
			}}
		>
			<div
				className="w-2/5 h-auto bg-slate-800 p-5 m-5 rounded-lg flex flex-col gap-2"
				data-ignore-click
			>
				<span className="inline-flex items-center">
					<h2 className="text-2xl">Edit details</h2>
					<Icon
						className="ml-auto rounded-full hover:bg-slate-400/20 p-2"
						type="close"
						onClick={handleClose}
					/>
				</span>
				{toastMessage && (
					<span className="bg-blue-600 rounded-md p-1 inline-flex flex-row gap-2 items-center">
						<Icon type="info" />
						<p className="text-sm">{toastMessage}</p>
					</span>
				)}
				<form encType="multipart/form-data" onSubmit={onSubmit}>
					<div className="grid grid-cols-2 grid-rows-1 gap-4 py-2 pb-5">
						<div className="relative w-auto h-auto aspect-square group">
							<img
								src={image}
								alt="Playlist Image"
								className="rounded-md h-full aspect-square object-cover"
							/>
							<div
								className="absolute top-1/2 left-1/2 bg-black/60 opacity-0 
								transition-opacity justify-center items-center group-hover:opacity-100 
								-translate-x-1/2 -translate-y-1/2 w-full h-full flex flex-col"
								onClick={() => {
									fileRef.current?.click();
								}}
							>
								<Icon type="edit" className="text-4xl" />
								<p>Choose photo</p>
								<input
									type="file"
									hidden
									ref={fileRef}
									onChange={onFileChange}
									id="image"
									name="image"
									accept="image/*"
								/>
							</div>
						</div>
						<div className="flex flex-col gap-5 h-full flex-grow">
							<Input
								max={50}
								type="INPUT"
								label="Name"
								value={name}
								className="text-sm w-full h-12"
								onChange={(e) => {
									setIsDirty(true);
									setName(e.target.value);
								}}
								name="name"
							/>
							<Input
								type="TEXTAREA"
								label="Description"
								value={description}
								placeHolder="Add an optional description"
								className="text-sm w-full h-full"
								parentClassName="flex-grow"
								onChange={(e) => {
									setIsDirty(true);
									setDescription(e.target.value);
								}}
								name="description"
							/>
							<div className="w-full flex">
								<label htmlFor="public" className="w-max">
									Public
								</label>
								<input
									className="ml-auto w-4 h-4 rounded
									bg-slate-500 appearance-none accent-accent
									checked:appearance-auto"
									type="checkbox"
									name="public"
									id="public"
									onChange={(e) =>
										setIsPublic(e.target.checked)
									}
									checked={isPublic}
								/>
							</div>
						</div>
					</div>
					<div className="flex gap-2">
						<p className="text-[0.5rem] text-wrap select-none">
							By continuing with the process, you hereby consent
							to granting Shitify the necessary permissions to
							access and utilize the image you select for
							uploading. It is your responsibility to ensure that
							you possess the legal authority and appropriate
							rights to upload the image in question, and that you
							are fully aware of the implications associated with
							doing so, including but not limited to the
							ownership, distribution, and usage rights of said
							image, both within the context of Shitify's platform
							and beyond. Please verify that all necessary
							permissions and rights are secured before proceeding
							with the upload of your chosen image.
						</p>
						<button
							type="submit"
							className="bg-accent w-max text-xl p-3 px-5 rounded-xl"
							disabled={mutation.isPending}
						>
							Save
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
