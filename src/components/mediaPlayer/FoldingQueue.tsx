import { FoldAtom } from "@atoms/atoms";
import { MediaAtom, TogglesAtom } from "@atoms/MediaPlayerAtoms";
import Icon from "@components/shared/Icon";
import { useSetQueueIndex } from "@hooks/mediaHooks";
import { animated, useSpring } from "@react-spring/web";
import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { ReactSortable } from "react-sortablejs";

interface IMappedQueue {
	artist_id: string;
	artist: string;
	album_id: string;
	album: string;
	name: string;
	duration: number;
	index: number;
	path: string;
	image: string;
	id: string;
}

export default function FoldingQueue() {
	const [isActive, setIsActive] = useAtom(FoldAtom);
	const divRef = useRef<HTMLDivElement | null>(null);

	const animation = useSpring({
		transform: isActive ? "translateY(0%)" : "translateY(-5%)",
		opacity: isActive ? 1 : 0,
		config: { tension: 170, friction: 26, duration: 100 },
	});

	const [mediaAtom, setMediaAtom] = useAtom(MediaAtom);
	const [mediaToggles, setMediaToggles] = useAtom(TogglesAtom);
	const setQueueIndex = useSetQueueIndex();

	useEffect(() => {
		const handler = (e: MouseEvent) => {
			const target = e.target as HTMLElement;

			if (!target) return;

			// Ignore if clicking on this element
			if (divRef.current && divRef.current.contains(target as Node))
				return;

			// Check if the click is on elements with the 'data-ignore-click' attribute
			if (target.closest("[data-ignore-click]")) {
				return; // Ignore clicks on these elements
			}

			// Deactivate otherwise
			setIsActive(false);
		};

		document.addEventListener("click", handler);

		return () => {
			document.removeEventListener("click", handler);
		};
	}, []);

	const onRemoveElement = (index: number) => {
		const newQueue = Array.from(mediaAtom.queue);
		newQueue.splice(index, 1);
		let updatedQueueIndex = mediaAtom.queueIndex;

		// Adjust the queue index if necessary
		if (index < mediaAtom.queueIndex) {
			updatedQueueIndex -= 1;
		}

		if (newQueue.length <= 1) {
			setIsActive(false);
		}

		setMediaAtom({
			...mediaAtom,
			queue: newQueue,
			queueIndex: updatedQueueIndex,
		});
	};

	const mappedQueue = mediaAtom.queue.map((item) => {
		const { track_id, ...rest } = item;
		return { id: track_id, ...rest };
	});

	return (
		<animated.div
			className="absolute w-[30rem] rounded-md bg-slate-800 z-50
			bottom-full mb-4 overflow-y-scroll overflow-x-hidden max-h-[50vh]"
			style={{ ...animation, pointerEvents: isActive ? "auto" : "none" }}
			ref={divRef}
		>
			<ReactSortable
				list={mappedQueue}
				onEnd={(evt) => {
					if (evt.oldIndex === undefined || evt.newIndex === undefined) return;


					let updatedQueueIndex = mediaAtom.queueIndex;

					if (mediaAtom.queueIndex === evt.oldIndex) {
						updatedQueueIndex = evt.newIndex;
					} else if (
						mediaAtom.queueIndex > evt.oldIndex &&
						mediaAtom.queueIndex <= evt.newIndex
					) {
						// Shift the index back if the current queue item is after the source and within the destination range
						updatedQueueIndex -= 1;
					} else if (
						mediaAtom.queueIndex < evt.oldIndex &&
						mediaAtom.queueIndex >= evt.newIndex
					) {
						// Shift the index forward if the current queue item is before the source and within the destination range
						updatedQueueIndex += 1;
					}

					setMediaAtom((_mediaAtom) => {
						return { ..._mediaAtom, queueIndex: updatedQueueIndex };
					});
				}}
				setList={(newQueue) => {
					if (!isActive) return;

					const queue = newQueue.map((item) => {
						const { id, ...rest } = item;
						return { track_id: id, ...rest };
					});

					setMediaAtom((_mediaAtom) => {
						return { ..._mediaAtom, queue: queue };
					});
				}}
			>
				{mediaAtom.queue.map((element, idx) => {
					return (
						<QueueItem
							image={element.image}
							album={element.album}
							name={element.name}
							artist={element.artist}
							queueIndex={mediaAtom.queueIndex}
							index={idx}
							onClick={() => {
								setQueueIndex(idx);
								setMediaToggles({
									...mediaToggles,
									isPlaying: true,
								});
							}}
							onRemove={() => onRemoveElement(idx)}
						/>
					);
				})}
			</ReactSortable>
		</animated.div>
	);
}

function QueueItem(props: IQueueItem) {
	return (
		<div
			className="bg-slate-800 rounded-md h-16 flex flex-row items-center gap-3 p-1"
			onDoubleClick={props.onClick}
			key={props.name}
		>
			<img
				src={props.image}
				alt={`${props.album} image`}
				className="p-1 rounded-lg h-full aspect-square"
			/>
			<div>
				<h1
					className={twMerge(
						"text-lg truncate",
						props.queueIndex === props.index ? "text-accent" : ""
					)}
				>
					{props.name}
				</h1>
				<p className="text-sm font-light text-slate-400">
					{props.artist}
				</p>
			</div>
			<div className="ml-auto p-2 flex flex-row gap-4">
				<Icon
					type="close"
					className="text-slate-400 hover:text-slate-500"
					onClick={props.onRemove}
				/>
			</div>
		</div>
	);
}

interface IQueueItem {
	image: string;
	album: string;
	name: string;
	artist: string;

	queueIndex: number;
	index: number;
	onClick: () => void;
	onRemove: () => void;
}
