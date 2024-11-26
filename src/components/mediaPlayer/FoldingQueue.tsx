import { FoldAtom } from "@atoms/atoms";
import {
	AccentColorAtom,
	MediaAtom,
	TogglesAtom,
} from "@atoms/MediaPlayerAtoms";
import Icon from "@components/shared/Icon";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useSetQueueIndex } from "@hooks/mediaHooks";
import { animated, useSpring } from "@react-spring/web";
import { useAtom, useAtomValue } from "jotai";
import { forwardRef, Ref, useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";

export default function FoldingQueue() {
	const [isActive, setIsActive] = useAtom(FoldAtom);
	const divRef = useRef<HTMLDivElement | null>(null);
	const selectedRef = useRef<HTMLLIElement | null>(null);

	const animation = useSpring({
		transform: isActive ? "translateY(0%)" : "translateY(-5%)",
		opacity: isActive ? 1 : 0,
		config: { tension: 170, friction: 26 },
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

	useEffect(() => {
		if (isActive === false) return;

		if (divRef.current && selectedRef.current) {
			// Scroll the container to bring the selected element to the top
			const container = divRef.current;
			const selected = selectedRef.current;

			// Calculate the offset of the selected element relative to the container
			const containerTop = container.getBoundingClientRect().top;
			const selectedTop = selected.getBoundingClientRect().top;

			// Adjust the scroll position
			container.scrollTop += selectedTop - containerTop;
		}
	}, [isActive]);

	// Function to handle reordering items
	const handleDragEnd = (result: { destination: any; source: any }) => {
		const { destination, source } = result;

		// If the item was dropped outside the droppable area, do nothing
		if (!destination) return;

		// If the item is dropped in the same position, do nothing
		if (destination.index === source.index) return;

		const reorderedItems = Array.from(mediaAtom.queue);
		const [removed] = reorderedItems.splice(source.index, 1); // Remove the item from its original position
		reorderedItems.splice(destination.index, 0, removed); // Insert the item at its new position

		// Change index if moving current song.
		let updatedQueueIndex = mediaAtom.queueIndex;

		// Update the queue index only if the current queue item is being moved
		if (mediaAtom.queueIndex === source.index) {
			updatedQueueIndex = destination.index;
		} else if (
			mediaAtom.queueIndex > source.index &&
			mediaAtom.queueIndex <= destination.index
		) {
			// Shift the index back if the current queue item is after the source and within the destination range
			updatedQueueIndex -= 1;
		} else if (
			mediaAtom.queueIndex < source.index &&
			mediaAtom.queueIndex >= destination.index
		) {
			// Shift the index forward if the current queue item is before the source and within the destination range
			updatedQueueIndex += 1;
		}

		setMediaAtom({
			...mediaAtom,
			queue: reorderedItems,
			queueIndex: updatedQueueIndex,
		});
	};

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

	return (
		<animated.div
			ref={divRef}
			className="absolute w-[30rem] rounded-md bg-slate-800
				bottom-full mb-4 overflow-y-scroll overflow-x-hidden max-h-[30vh]"
			style={{ ...animation, pointerEvents: isActive ? "auto" : "none" }}
		>
			<DragDropContext onDragEnd={handleDragEnd}>
				<Droppable droppableId="droppable">
					{(provided) => (
						<div
							ref={provided.innerRef}
							{...provided.droppableProps}
						>
							{mediaAtom.queue.map((element, index) => {
								return (
									<DraggableListItem
										key={element.name + index}
										element={element}
										index={index}
										queueIndex={mediaAtom.queueIndex}
										selectedRef={selectedRef}
										onClick={() => {
											setQueueIndex(index);
											setMediaToggles({
												...mediaToggles,
												isPlaying: true,
											});
										}}
										onRemove={() => onRemoveElement(index)}
									/>
								);
							})}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</DragDropContext>
		</animated.div>
	);
}

interface ListItemProps {
	image: string;
	album: string;
	name: string;
	artist: string;

	queueIndex: number;
	index: number;
	onClick?: () => void;
	onRemove?: () => void;
}

interface IDraggableListItem {
	element: Track;
	index: number;
	queueIndex: number;
	onClick: () => void;
	onRemove: () => void;
	selectedRef: Ref<HTMLLIElement>;
}

function DraggableListItem({
	element,
	index,
	queueIndex,
	onClick,
	onRemove,
	selectedRef,
}: IDraggableListItem) {
	return (
		<Draggable
			draggableId={element.name}
			index={index}
			key={element.name + index}
		>
			{(provided) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					style={provided.draggableProps.style}
				>
					<ListItem
						ref={index === queueIndex ? selectedRef : null}
						{...element}
						queueIndex={queueIndex}
						index={index}
						onClick={onClick}
						onRemove={onRemove}
					/>
				</div>
			)}
		</Draggable>
	);
}

const ListItem = forwardRef<HTMLLIElement, ListItemProps>(
	(
		{
			image,
			album,
			name,
			artist,

			queueIndex,
			index,
			onClick,
			onRemove,
		},
		ref
	) => {
		const accentColor = useAtomValue(AccentColorAtom);

		return (
			<li
				ref={ref}
				className="bg-slate-800 rounded-md h-16 flex flex-row items-center gap-3 p-1"
				onDoubleClick={onClick}
			>
				<img
					src={image}
					alt={`${album} image`}
					className="p-1 rounded-lg h-full aspect-square"
				/>
				<div>
					<h1
						className={twMerge(
							"text-lg truncate",
							queueIndex === index ? "text-accent" : ""
						)}
					>
						{name}
					</h1>
					<p className="text-sm font-light text-slate-400">
						{artist}
					</p>
				</div>
				<div className="ml-auto p-2 flex flex-row gap-4">
					<Icon
						type="close"
						className="text-slate-400 hover:text-slate-500"
						onClick={onRemove}
					/>
				</div>
			</li>
		);
	}
);
