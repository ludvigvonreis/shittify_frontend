import { MediaNodesAtom } from "@atoms/MediaPlayerAtoms";
import { useAtomValue } from "jotai";
import { useEffect, useRef } from "react";

interface AudioVizualizerProps {
	className: string;
}

export default function AudioVizualizer(props: AudioVizualizerProps) {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const bufferLength = 5;
	const dataArray = useRef(new Uint8Array(bufferLength));
	const previousHeights = useRef(new Array(bufferLength).fill(0));

	const mediaNodes = useAtomValue(MediaNodesAtom);

	useEffect(() => {
		if (!mediaNodes || !mediaNodes.current) return;

		const canvas = canvasRef.current;
		const ctx = canvas?.getContext("2d");
		const analyser = mediaNodes.current.analyzerNode;

		const animate = () => {
			requestAnimationFrame(animate);
			analyser.getByteFrequencyData(dataArray.current);

			if (ctx && canvas) {
				ctx.clearRect(0, 0, canvas.width, canvas.height);

				const barWidth = (canvas.width / bufferLength) * 0.8; // Adjust bar width to account for spacing
				const barSpacing = (canvas.width / bufferLength) * 0.2; // Set spacing between bars (20% of the bar width)

				// Draw bars with smoothing
				for (let i = 0; i < bufferLength; i++) {
					const targetHeight = dataArray.current[i];

					// Apply linear interpolation to smooth the transition between the current and previous height
					const smoothingFactor = 0.1; // Higher value = less smoothing (faster)
					const smoothedHeight =
						previousHeights.current[i] +
						smoothingFactor *
							(targetHeight - previousHeights.current[i]);

					previousHeights.current[i] = smoothedHeight; // Store the smoothed height for the next frame

					const x = i * (barWidth + barSpacing); // Add spacing between bars
					const y = canvas.height - smoothedHeight - 10; // Start drawing from the bottom of the canvas

					// Set the color of the bars
					//ctx.fillStyle = `rgb(${smoothedHeight + 100}, 50, 50)`;
					ctx.fillStyle = "rgb(0,255,0)";
					ctx.fillRect(x, y, barWidth, smoothedHeight);
				}
			}
		};

		requestAnimationFrame(animate);
	}, []);

	return (
		<canvas
			className={props.className}
			ref={canvasRef}
			width={500}
			height={200}
		/>
	);
}
