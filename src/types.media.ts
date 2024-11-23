interface Album {
	length?: number; // Total length of songs in seconds
	amount: number; // Amount of songs in album.
	albumCoverSrc: string;
	title: string;
	artist: string;
	releaseDate: string;
	artistId: string;
	contents: Track[];
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

interface SearchResults {
	artist_id: string
	artist_name: string
	artist_image: string
	artist_genre: string
	album_id: string
	album_name: string
	release_date: string
	album_image: string
	track_id: string
	track_name: string
	track_duration: number
	track_index: number
	track_path: string
}