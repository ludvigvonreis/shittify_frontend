interface Album {
	album_id: string;
	artist_id: string;
	name: string;
	release_date: string;
	image: string;
}

interface Track {
	artist_id: string;
	artist: string;

	album_id: string;
	album: string;

	track_id: string;
	name: string;

	duration: number;

	index: number;
	path: string; // url of media file
	image: string; // url of cover image
}

interface Artist {
	artist_id: string;
	name: string;
	genre: string;
	image: string;
}
