
import { Media, MediaListResponse, MediaDetails } from '../types/media';

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

// A mapping from our app's slugs to TMDB genre IDs
const genreMap = {
    anime: { type: 'keyword', id: 210024 }, // keyword for "anime"
    cartoons: { type: 'genre', id: 16 },
    horror: { type: 'genre', id: 27 },
    scifi: { type: 'genre', id: [878, 14] }, // Sci-Fi & Fantasy
    movies: { type: 'genre', id: [28, 18] }, // Action & Drama
};

async function fetchTMDB(endpoint: string, params: string = ''): Promise<any> {
    const url = `${BASE_URL}/${endpoint}?api_key=${API_KEY}&${params}`;
    const res = await fetch(url, { next: { revalidate: 3600 } }); // Cache for 1 hour
    if (!res.ok) {
        console.error(`Failed to fetch from TMDB: ${res.statusText}`);
        return null;
    }
    return res.json();
}

export async function getTrending(mediaType: 'all' | 'movie' | 'tv' = 'all', timeWindow: 'day' | 'week' = 'week'): Promise<Media[]> {
    const data = await fetchTMDB(`trending/${mediaType}/${timeWindow}`);
    return data?.results || [];
}

export async function getDiscover(genreSlug: string, sort_by = 'popularity.desc'): Promise<Media[]> {
    const genreInfo = genreMap[genreSlug as keyof typeof genreMap];
    if (!genreInfo) return [];

    let params = `language=en-US&sort_by=${sort_by}&include_adult=false&include_video=false&page=1`;

    if (genreInfo.type === 'keyword') {
        params += `&with_keywords=${genreInfo.id}`;
    } else {
        const genreIds = Array.isArray(genreInfo.id) ? genreInfo.id.join(',') : genreInfo.id;
        params += `&with_genres=${genreIds}`;
    }
    
    if (genreSlug === 'cartoons') {
        params += '&certification_country=US&certification.lte=PG';
    }
    
    const data = await fetchTMDB('discover/movie', params);
    return data?.results || [];
}

/**
 * Fetches comprehensive details for a specific movie or TV show.
 */
export async function getMediaDetails(type: 'movie' | 'tv', id: string): Promise<MediaDetails | null> {
    const params = 'append_to_response=credits,external_ids';
    const data = await fetchTMDB(`${type}/${id}`, params);
    if (!data) return null;

    // Add media_type to the response for easier handling on the frontend
    data.media_type = type;
    return data as MediaDetails;
}
