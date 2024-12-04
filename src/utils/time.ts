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
	const { minutes, seconds } = convertSecondsToTimeObject(_seconds);

	return `${minutes} min, ${seconds} sec`;
}

export function secondsToClockFormat(_seconds: number) {
	const { minutes, seconds } = convertSecondsToTimeObject(_seconds);

	return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function formatDate(inputDate: Date): string {
	const now = new Date();
	const diffMs = now.getTime() - inputDate.getTime();
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

	let result: string;

	if (diffDays < 30) {
		// Use Intl.RelativeTimeFormat for recent dates
		const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
		result = rtf.format(-diffDays, "day");
	} else {
		// Use Intl.DateTimeFormat for older dates
		const dateFormatter = new Intl.DateTimeFormat("en", {
			day: "numeric",
			month: "short",
			year: "numeric",
		});
		result = dateFormatter.format(inputDate);
	}

	// Capitalize the first letter
	return result.charAt(0).toUpperCase() + result.slice(1);
}
