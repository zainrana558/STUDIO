
export interface Genre {
  id: number;
  name: string;
}

export interface Video {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
}

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
  genres: Genre[];
  videos: { results: Video[] };
}

export interface MediaListResponse {
    page: number;
    results: Media[];
    total_pages: number;
    total_results: number;
}
