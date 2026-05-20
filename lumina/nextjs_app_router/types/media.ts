
export interface Media {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  backdrop_path: string;
  release_date?: string;
  first_air_date?: string;
  media_type?: 'movie' | 'tv';
  overview: string;
  vote_average: number;
}

export interface MediaListResponse {
    page: number;
    results: Media[];
    total_pages: number;
    total_results: number;
}

// --- Detailed view interfaces for the player page ---

export interface CastMember {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
}

export interface Genre {
    id: number;
    name: string;
}

export interface Season {
    id: number;
    season_number: number;
    episode_count: number;
    poster_path: string | null;
    air_date: string;
}

export interface MediaDetails extends Media {
    genres: Genre[];
    credits: {
        cast: CastMember[];
    };
    // TV-specific
    seasons?: Season[];
    number_of_seasons?: number;
    // Movie-specific
    runtime?: number;
    imdb_id?: string;
}
