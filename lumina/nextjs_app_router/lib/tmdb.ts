
import { Media, MediaListResponse } from '../types/media';

const API_ACCESS_TOKEN = process.env.TMDB_API_ACCESS_TOKEN;
const BASE_URL = 'https://api.themoviedb.org/3';

const genreMap = {
    anime: { type: 'keyword', id: 210024 },
    cartoons: { type: 'genre', id: 16 },
    horror: { type: 'genre', id: 27 },
    scifi: { type: 'genre', id: [878, 14] }, 
    movies: { type: 'genre', id: [28, 18] },
};

async function fetchTMDB(endpoint: string, params: string = ''): Promise<any> {
    if (!API_ACCESS_TOKEN) {
        console.error('Error: TMDB_API_ACCESS_TOKEN is not configured in your environment variables.');
        return null;
    }

    const url = `${BASE_URL}/${endpoint}?${params}`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${API_ACCESS_TOKEN}`
        },
        next: { revalidate: 3600 } // Cache for 1 hour
    };

    const res = await fetch(url, options);
    
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

export async function getMediaDetails(type: 'movie' | 'tv', id: string): Promise<Media | null> {
    const params = 'append_to_response=videos';
    const data = await fetchTMDB(`${type}/${id}`, params);
    if (!data) return null;

    data.media_type = type;
    return data as Media;
}

// Wrapper functions for movie and TV discover
export async function getDiscoverMovies(genreSlug: string, sort_by = 'popularity.desc'): Promise<Media[]> {
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

export async function getDiscoverTV(genreSlug: string, sort_by = 'popularity.desc'): Promise<Media[]> {
    const genreInfo = genreMap[genreSlug as keyof typeof genreMap];
    if (!genreInfo) return [];

    let params = `language=en-US&sort_by=${sort_by}&include_adult=false&include_video=false&page=1`;

    if (genreInfo.type === 'keyword') {
        params += `&with_keywords=${genreInfo.id}`;
    } else {
        const genreIds = Array.isArray(genreInfo.id) ? genreInfo.id.join(',') : genreInfo.id;
        params += `&with_genres=${genreIds}`;
    }

    const data = await fetchTMDB('discover/tv', params);
    return data?.results || [];
}
