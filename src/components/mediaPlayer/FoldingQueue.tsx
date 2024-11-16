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
import { useRef } from "react";
import { twMerge } from "tailwind-merge";

interface FoldingQueueProps {
	isActive: boolean;
}

export default function FoldingQueue({ isActive }: FoldingQueueProps) {
	const divRef = useRef<HTMLDivElement | null>(null);

	const maxHeight = (window.innerHeight * 50) / 100;

	const animation = useSpring({
		height: isActive
			? Math.min(divRef.current?.scrollHeight || 0, maxHeight)
			: 0,
		opacity: isActive ? 1 : 0,
		overflow: "hidden",
		config: { tension: 170, friction: 26 },
	});

	const [mediaAtom, setMediaAtom] = useAtom(MediaAtom);
	const [mediaToggles, setMediaToggles] = useAtom(TogglesAtom);
	const setQueueIndex = useSetQueueIndex();

	// Function to handle reordering items
	const handleDragEnd = (result: { destination: any; source: any }) => {
		const { destination, source } = result;

		console.log("hello");

		// If the item was dropped outside the droppable area, do nothing
		if (!destination) return;

		// If the item is dropped in the same position, do nothing
		if (destination.index === source.index) return;

		const reorderedItems = Array.from(mediaAtom.queue);
		const [removed] = reorderedItems.splice(source.index, 1); // Remove the item from its original position
		reorderedItems.splice(destination.index, 0, removed); // Insert the item at its new position

		setMediaAtom({
			...mediaAtom,
			queue: reorderedItems,
			queueIndex: destination.index,
		});
	};

	return (
		<animated.div
			ref={divRef}
			className="absolute w-full rounded-md bg-slate-900 bottom-full max-h-[50vh] mb-4"
			style={animation}
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
									<Draggable
										draggableId={element.name}
										index={index}
										key={element.name}
									>
										{(provided) => (
											<div
												ref={provided.innerRef}
												{...provided.draggableProps}
												{...provided.dragHandleProps}
												style={
													provided.draggableProps
														.style
												}
											>
												<ListItem
													{...element}
													queueIndex={
														mediaAtom.queueIndex
													}
													index={index}
													onClick={() => {
														setQueueIndex(index);
														setMediaToggles({
															...mediaToggles,
															isPlaying: true,
														});
													}}
												/>
											</div>
										)}
									</Draggable>
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
}

function ListItem({
	image,
	album,
	name,
	artist,

	queueIndex,
	index,
	onClick,
}: ListItemProps) {
	const accentColor = useAtomValue(AccentColorAtom);

	return (
		<li
			className="bg-slate-800 h-16 flex flex-row items-center"
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
						"text-lg",
						queueIndex === index ? accentColor.text : ""
					)}
				>
					{name}
				</h1>
				<p className="text-sm font-light text-slate-400">{artist}</p>
			</div>

			<Icon type="menu" className="ml-auto p-2 text-slate-400" />
		</li>
	);
}
