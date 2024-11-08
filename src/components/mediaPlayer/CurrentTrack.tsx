interface CurrentTrackProps {
	title: string;
	artist: string;
	converSrc: string;
}

export default function CurrentTrack(props: CurrentTrackProps) {
	return (
		<div className="flex justify-start items-center p-1 gap-4 select-none">
			<img
				src={props.converSrc}
				alt="Uhh"
				className="h-full aspect-square border border-slate-800 
						   rounded-md transition-transform hover:scale-105"
			/>
			<div>
				<h1 className="hover:underline font-bold cursor-pointer">
					{props.title}
				</h1>
				<p className="hover:underline text-sm text-slate-400 cursor-pointer">
					{props.artist}
				</p>
			</div>
		</div>
	);
}
