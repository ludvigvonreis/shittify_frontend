export function convertSecondsToTimeObject(_seconds: number) {
	const seconds = parseInt(_seconds.toFixed(0));

	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const remainingSeconds = seconds % 60;

	return {
		hours,
		minutes,
		seconds: remainingSeconds,
	};
}

export function secondsToReadable(_seconds: number) {
	const { minutes, seconds } = convertSecondsToTimeObject(_seconds)
	
	return `${minutes} min, ${seconds} sec`;
}

export function secondsToClockFormat(_seconds: number) {
	const { minutes, seconds } = convertSecondsToTimeObject(_seconds)

	return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}