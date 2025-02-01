import AddToPlaylist from "@components/shared/AddMenu";
import Icon from "@components/shared/Icon";
import { Link } from "@tanstack/react-router";
import { formatDate, secondsToClockFormat } from "@utils/time";
import { atom, useAtom, useSetAtom } from "jotai";
import React, { useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";

const PopoverAtom = atom({ visible: false, id: "" });

interface ITrackTable {
	children: React.ReactNode | React.ReactNode[];
	includeDate?: boolean;
	includeAlbum?: boolean;
}

interface ITrackListItem {
	element: Track;
	onDoubleClick?: () => void;
	currentTrack?: Track | null;

	includeDate?: boolean;
	includeAlbum?: boolean;
	includeImage?: boolean;
	date?: Date;
}

export default function TrackTable({
	children,
	includeAlbum,
	includeDate,
}: ITrackTable) {
	return (
		<div className="text-white p-4 rounded-lg">
			<div
				className="flex gap-5 text-slate-400 px-5
			pb-2 mb-5 border-b border-slate-700 select-none"
			>
				<p className="w-5 text-center">#</p>
				<p className="w-1/3">Title</p>
				{includeAlbum && <p className="w-1/3">Album</p>}
				{includeDate && <p>Date Added</p>}
				<span className="flex-grow-[3]"></span>
				<div className="w-20 inline-flex">
					<p className="flex-grow-[1]"></p>
					<Icon type="schedule" />
				</div>
			</div>
			<div>{children}</div>
		</div>
	);
}

export function TrackListItem({
	element,
	currentTrack,
	includeAlbum,
	includeDate,
	includeImage,
	date,
	onDoubleClick,
}: ITrackListItem) {
	const isCurrentTrack = currentTrack?.track_id === element.track_id;
	const playPauseIcon = isCurrentTrack ? "pause" : "play_arrow";
	const trackTextStyle = isCurrentTrack ? "text-accent" : "";
	const [popOver, setPopover] = useAtom(PopoverAtom);

	const handleButtonClick = (id: string) => {
		setPopover((prev) => ({
			visible: prev.id !== id || !prev.visible,
			id,
		}));
	};

	const handleClose = () => {
		setPopover({ visible: false, id: "" });
	};

	const _onDoubleClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
		const target = e.target as HTMLElement;

		// Check if the click is on elements with the 'data-ignore-click' attribute
		if (target.closest("[data-ignore-click]")) {
			return; // Ignore clicks on these elements
		}

		if (onDoubleClick) onDoubleClick();
	};

	return (
		<article
			className="flex gap-5 select-none group items-center relative
			hover:bg-slate-800 rounded-md py-2 px-5 focus:bg-slate-800"
			tabIndex={0}
			onDoubleClick={_onDoubleClick}
		>
			{popOver.visible && popOver.id === element.track_id && (
				<AddToPlaylist
					track_id={element.track_id}
					track_name={element.name}
					setOpen={handleClose}
				/>
			)}
			<div className="relative inline-flex items-center justify-center w-5 h-5 overflow-hidden">
				<span
					className={twMerge(
						`absolute w-full h-full flex items-center justify-center 
						text-lg opacity-100 group-hover:opacity-0`,
						trackTextStyle
					)}
				>
					{element.index}
				</span>
				<Icon
					type={playPauseIcon}
					className="absolute w-full h-full flex items-center 
					justify-center text-xl opacity-0 group-hover:opacity-100"
				/>
			</div>
			<div className="w-1/3 flex flex-row gap-2">
				{includeImage && (
					<img
						src={element.image}
						alt=""
						className="size-12 rounded-sm"
					/>
				)}
				<div className="flex flex-col">
					<span
						className={twMerge(
							"hover:underline w-max",
							trackTextStyle
						)}
					>
						<Link>{element.name}</Link>
					</span>
					<span className="font-light text-sm hover:underline w-max text-slate-400">
						<Link>{element.artist}</Link>
					</span>
				</div>
			</div>
			{includeAlbum && (
				<p className="w-1/3 truncate hover:underline">
					<Link
						to="/album/$albumid"
						params={{ albumid: element.album_id }}
					>
						{element.album}
					</Link>
				</p>
			)}
			{includeDate && date && (
				<p title={date.toUTCString()} className="truncate">
					{formatDate(date)}
				</p>
			)}
			<span className="flex-grow-[3]"></span>
			<div className="w-20 inline-flex">
				<Icon
					type={"add_circle"}
					onClick={(e) => handleButtonClick(element.track_id)}
					title="Add To Playlist"
					className="cursor-pointer opacity-1 text-slate-300
						group-hover:opacity-100 opacity-0 group-focus:opacity-100
						hover:text-inherit flex-grow"
				/>
				<time className="text-slate-400 text-light">
					{secondsToClockFormat(element.duration)}
				</time>
			</div>
		</article>
	);
}
