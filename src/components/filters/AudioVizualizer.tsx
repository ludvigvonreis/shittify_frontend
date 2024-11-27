import { AccentColorAtom, MediaNodesAtom } from "@atoms/MediaPlayerAtoms";
import { useAtomValue } from "jotai";
import { useEffect, useRef, useState } from "react";

interface AudioVizualizerProps {
	className: string;
}

function BottomUp(
	i: number,
	barWidth: number,
	barSpacing: number,
	canvasHeight: number,
	smoothedHeight: number,
	color: string,
	ctx: CanvasRenderingContext2D
) {
	const x = i * (barWidth + barSpacing);
	const y = canvasHeight - smoothedHeight + 20;

	ctx.fillStyle = color;
	ctx.fillRect(x, y, barWidth, smoothedHeight);
}

function MiddleOut(
	i: number,
	barWidth: number,
	barSpacing: number,
	canvasHeight: number,
	smoothedHeight: number,
	color: string,
	ctx: CanvasRenderingContext2D
) {
	const x = i * (barWidth + barSpacing);

	const centerY = canvasHeight / 2;
	const barHeight = smoothedHeight / 2;

	ctx.fillStyle = color;
	ctx.fillRect(x, centerY - barHeight, barWidth, barHeight); // Top half
	ctx.fillRect(x, centerY, barWidth, barHeight); // Bottom half
}

export default function AudioVizualizer(props: AudioVizualizerProps) {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const bufferLength = 256;
	const dataArray = useRef(new Uint8Array(bufferLength));
	const previousHeights = useRef(new Array(bufferLength).fill(0));

	const mediaNodes = useAtomValue(MediaNodesAtom);
	const accentColor = useAtomValue(AccentColorAtom);

	useEffect(() => {
		if (!mediaNodes || !mediaNodes.current) return;

		const canvas = canvasRef.current;
		const ctx = canvas?.getContext("2d");
		const analyser = mediaNodes.current.analyzerNode;
		analyser.fftSize = 1024;

		if (canvas && canvasRef.current) {
			const dpi = window.devicePixelRatio || 1;

			// Get the logical size of the canvas (CSS size)
			const cssWidth = canvasRef.current.clientWidth;
			const cssHeight = canvasRef.current.clientHeight;

			// Use the CSS size for both rendering and display
			canvas.width = cssWidth * dpi;
			canvas.height = cssHeight * dpi;
		}

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

					BottomUp(
						i,
						barWidth,
						barSpacing,
						canvas.height,
						smoothedHeight,
						accentColor,
						ctx
					);
				}
			}
		};

		requestAnimationFrame(animate);
	}, []);

	return (
		<canvas
			className={props.className}
			ref={canvasRef}
			width={800}
			height={200}
		/>
	);
}
