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


interface IMediaNodes {
	gainNode: GainNode;
	analyzerNode: AnalyserNode;
}


interface SearchResults {
	tracks: SearchTrack[];
	artists: SearchArtist[];
	albums: SearchAlbum[];
}

interface SearchTrack {
	track_id: string
	name: string
	duration: number
	index: number
	path: string
	album: string
	album_id: string
	album_image: string
	artist: string
	artist_id: string
	artist_image: string
}

interface SearchAlbum {
	album_id: string
	album_name: string
	release_date: string
	image: string
	artist: string
	artist_id: string
	artist_image: string
}

interface SearchArtist {
	artist_id: string
	name: string
	genre: string
	image: string
	search_tsv: string
}

interface Settings {
	accentColor: string;
}

interface PlaylistMetadata {
	playlist_id: string;
	user_id: string;
	name: string;
	description: string;
	image: string;
	public: boolean;
}