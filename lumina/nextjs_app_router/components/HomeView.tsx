"use client";

import { useState, useEffect, useTransition } from "react";
import { useDebounce } from "use-debounce";
import { Media, PaginatedAPIResponse } from "../types/media";
import { useRouter, useSearchParams } from "next/navigation";
import { MediaGrid } from "./MediaGrid";
import { SearchIcon } from "lucide-react";

interface HomeViewProps {
  initialTrending: Media[];
}

export function HomeView({ initialTrending }: HomeViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryFromUrl = searchParams.get("q") || "";

  const [query, setQuery] = useState(queryFromUrl);
  const [searchResults, setSearchResults] = useState<Media[]>([]);
  const [debouncedQuery] = useDebounce(query, 500); // 500ms debounce
  const [isSearching, startSearchTransition] = useTransition();

  useEffect(() => {
    const newUrl =
      debouncedQuery.trim() === ""
        ? "/"
        : `/?q=${encodeURIComponent(debouncedQuery)}`;
    router.replace(newUrl, { scroll: false });

    if (debouncedQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    startSearchTransition(async () => {
      // The fetch must be to our own API proxy
      const response: PaginatedAPIResponse<Media> = await fetch(
        `/api/tmdb/search/multi?query=${encodeURIComponent(debouncedQuery)}`
      ).then((res) => res.json());
      setSearchResults(response.results);
    });
  }, [debouncedQuery, router]);

  const mediaToDisplay =
    debouncedQuery.trim() !== "" ? searchResults : initialTrending;
  const isInitialState = debouncedQuery.trim() === "";

  return (
    <div className="space-y-8">
      <div className="relative w-full max-w-lg mx-auto">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for movies, TV shows..."
          className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
        />
      </div>

      <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
        {isInitialState ? "Trending This Week" : "Search Results"}
      </h2>
      {isSearching ? (
        <div className="text-center text-gray-400">Searching...</div>
      ) : (
        <MediaGrid media={mediaToDisplay} />
      )}
    </div>
  );
}