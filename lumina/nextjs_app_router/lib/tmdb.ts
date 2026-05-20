import "server-only";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_API_URL = "https://api.themoviedb.org/3";

if (!TMDB_API_KEY) {
  throw new Error("TMDB_API_KEY is not configured in environment variables.");
}

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

async function fetchTMDB<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params = {}, ...restOptions } = options;
  const url = new URL(`${TMDB_API_URL}/${endpoint}`);
  url.searchParams.append("api_key", TMDB_API_KEY);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  try {
    const response = await fetch(url.toString(), {
      ...restOptions,
      headers: {
        "Content-Type": "application/json",
        ...restOptions.headers,
      },
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error(
        `TMDB API Error (${response.status}): ${
          errorBody.status_message || "Unknown error"
        }`
      );
      throw new Error(
        `Failed to fetch from TMDB: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  } catch (error) {
    console.error("TMDB fetch failed:", error);
    throw new Error("Could not connect to TMDB API.");
  }
}

export const getTrending = (mediaType: "movie" | "tv") =>
  fetchTMDB(`trending/${mediaType}/week`);

export const searchMedia = (query: string, page: number = 1) =>
  fetchTMDB("search/multi", {
    params: { query, page: String(page), include_adult: "false" },
  });

export const getMediaDetails = (mediaType: string, id: string) =>
  fetchTMDB(`${mediaType}/${id}`, {
    params: { append_to_response: "videos,credits,recommendations" },
  });
