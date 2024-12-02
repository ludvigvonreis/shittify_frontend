import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import Fuse from "fuse.js";
import { fetchWithAuth } from "@utils/fetchWithAuth";

export function useSearchResults(query: string) {
	// Fetch search results
	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["search", query],
		queryFn: () => fetchWithAuth<SearchResults>(`http://localhost:3000/api/v1/search/${query}`),
		placeholderData: keepPreviousData,
	});

	// Compute most relevant result only if data is available
	const mostRelevant = useMemo(() => {
		if (!data) return null;

		const { tracks, albums, artists } = data;

		const normalizedResults: (SearchTrack | SearchAlbum | SearchArtist)[] = [
			...tracks.map((track) => ({
				...track,
				_track_name: track.name, // Rename track's 'name' field to 'track_name'
				artist_name: track.artist, // Make sure artist is standardized
				type: 'track',
			})),
			...albums.map((album) => ({
				...album,
				_album_name: album.album_name, // Keep album_name as it is (already appropriate)
				artist_name: album.artist, // Standardize the artist field
				type: 'album',
			})),
			...artists.map((artist) => ({
				...artist,
				_artist_name: artist.name, // Rename 'name' to 'artist_name' for consistency
				type: 'artist',
			})),
		];

		// Fuse.js for fuzzy matching (or use your custom relevance logic)
		const fuse = new Fuse(normalizedResults, {
			keys: ['_track_name', '_album_name', '_artist_name'],
			threshold: 0.3, // Adjust for how loose or strict you want the match to be
			shouldSort: true, // Sort results so exact matches appear first
			findAllMatches: true, // Find all matches
			includeScore: true, // Include the score to prioritize higher-quality matches
			ignoreLocation: true, // Ignore location in text to avoid issues with large strings
			useExtendedSearch: true, // Enable extended search syntax (allow exact matching)
		});

		// Find the most relevant match based on the query
		const result = fuse.search(query);
		return result[0]?.item || null; // Return the most relevant result, or null if none found
	}, [data, query]);

	return {
		isLoading,
		isError,
		data, // Full data (tracks, albums, artists)
		mostRelevant, // Most relevant result based on the query
		error,
	};
}
