export interface Media {
  id: number;
  title: string;
  name?: string; // For TV shows
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date?: string; // For movies
  first_air_date?: string; // For TV shows
}

// The full details object, extending the base Media type
export interface MediaDetails extends Media {
    genres: { id: number; name: string }[];
    seasons?: { season_number: number; episode_count: number; name: string; id: number; }[];
    // ... other details
}
