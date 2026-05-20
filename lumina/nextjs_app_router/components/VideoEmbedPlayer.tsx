"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { Loader2, AlertTriangle, Layers, CheckCircle, Maximize, Minimize, Tv } from "lucide-react";
import { MediaDetails } from "../../../types/media";

// --- Configuration ---
const PROVIDER_TIMEOUT_MS = 12000; // 12 seconds to wait for a provider to load
const EMBED_PROVIDERS = [
  { key: "vidsrc", name: "VidSrc (Primary)" },
  { key: "nexstream", name: "NexStream (API)" },
  { key: "vidphantom", name: "VidPhantom (Legacy)" },
  { key: "2embed", name: "2Embed (Legacy)" },
];

// --- Types ---
interface VideoEmbedPlayerProps {
  id: number;
  media_type: "movie" | "tv";
  details?: MediaDetails | null;
}

type PlayerStatus = 'loading' | 'loaded' | 'error';
interface PlayerState {
  status: PlayerStatus;
  message: string;
}

// --- Custom Hooks ---
function usePersistentState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      if (typeof window === 'undefined') return defaultValue;
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.warn(`Error saving to localStorage key "${key}":`, error);
    }
  }, [key, state]);

  return [state, setState];
}


export const VideoEmbedPlayer: React.FC<VideoEmbedPlayerProps> = ({ id, media_type, details }) => {
  // --- State Management ---
  const [playerState, setPlayerState] = useState<PlayerState>({ status: "loading", message: "Initializing..." });
  const [selectedProviderKey, setSelectedProviderKey] = usePersistentState("lumina-player-provider", EMBED_PROVIDERS[0].key);
  const [currentSeason, setCurrentSeason] = usePersistentState(`lumina-player-season-${id}`, 1);
  const [currentEpisode, setCurrentEpisode] = usePersistentState(`lumina-player-episode-${id}`, 1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isTv = media_type === "tv";
  const selectedProviderName = EMBED_PROVIDERS.find((p) => p.key === selectedProviderKey)?.name || "Unknown";

  // --- Memos and Callbacks ---
  const activeUrl = useMemo(() => {
    const params = new URLSearchParams({
      media_type,
      provider: selectedProviderKey,
    });
    if (isTv) {
      params.set("s", String(currentSeason));
      params.set("e", String(currentEpisode));
    }
    return `/api/embed/${id}?${params.toString()}`;
  }, [id, media_type, selectedProviderKey, isTv, currentSeason, currentEpisode]);

  const handleFullscreenToggle = () => {
    const elem = document.getElementById("lumina-embedded-player-container");
    if (!elem) return;

    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch((err) => console.warn(`Fullscreen request failed: ${err.message}`));
    } else {
      document.exitFullscreen();
    }
  };
  
  const handleIframeLoad = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setPlayerState({ status: 'loaded', message: 'Stream loaded successfully.' });
  };
  
  const handleIframeError = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setPlayerState({ status: 'error', message: `The provider failed to load the resource. This may be a network issue or a problem with the provider.` });
  };

  const handleSeasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentSeason(Number(e.target.value));
    setCurrentEpisode(1); // Reset to first episode of new season
  };
  
  const handleEpisodeClick = (episodeNumber: number) => {
    setCurrentEpisode(episodeNumber);
  };

  // --- Effects ---
  useEffect(() => {
    setPlayerState({ status: "loading", message: `Connecting via ${selectedProviderName}...` });

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
        setPlayerState({ status: 'error', message: `Provider Timeout: ${selectedProviderName} took too long to respond. Please try another provider.` });
    }, PROVIDER_TIMEOUT_MS);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [activeUrl, selectedProviderName]);

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const seasons = details?.seasons?.filter(s => s.season_number > 0); // Exclude "Specials"
  const episodes = seasons?.find(s => s.season_number === currentSeason)?.episode_count;

  return (
    <div className="flex flex-col gap-4 w-full select-none">
      <div id="lumina-embedded-player-container" className="relative w-full aspect-video rounded-lg bg-black border border-white/10 overflow-hidden shadow-2xl group">
        <iframe
          key={activeUrl}
          id="lumina-cinema-frame"
          src={activeUrl}
          title="Lumina Secure Stream Player"
          className="w-full h-full border-0 absolute inset-0 z-10 bg-black"
          frameBorder="0"
          sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-pointer-lock"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
        {playerState.status === "loading" && (
          <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center gap-4 z-20 transition-opacity duration-300">
            <Loader2 className="w-10 h-10 text-rose-500 animate-spin" />
            <div className="text-center font-mono">
              <p className="text-sm font-bold text-gray-200 tracking-wider uppercase">Establishing Secure Link</p>
              <p className="text-xs text-gray-500 mt-1">{playerState.message}</p>
            </div>
          </div>
        )}
        {playerState.status === "error" && (
          <div className="absolute inset-0 bg-gradient-to-br from-red-950 to-black flex flex-col items-center justify-center p-4 text-center gap-4 z-20">
            <AlertTriangle className="w-12 h-12 text-amber-500" />
            <div>
              <h3 className="text-lg font-bold font-mono text-white uppercase tracking-widest">Stream Unavailable</h3>
              <p className="text-sm text-gray-300 mt-2 max-w-md">{playerState.message}</p>
            </div>
            <p className="text-xs text-gray-500 font-mono">SELECT A DIFFERENT PROVIDER BELOW</p>
          </div>
        )}
        <div className="absolute top-3 left-3 right-3 z-30 flex justify-between items-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="px-3 py-1.5 rounded-lg bg-black/70 border border-white/10 backdrop-blur-sm">
            <span className="text-xs text-gray-200 font-mono font-bold uppercase tracking-wider">
              {isTv ? `S${String(currentSeason).padStart(2, '0')} E${String(currentEpisode).padStart(2, '0')}` : "Movie"}
            </span>
          </div>
          <button onClick={handleFullscreenToggle} className="p-2.5 rounded-full bg-black/70 border border-white/10 backdrop-blur-sm text-gray-200 hover:text-white pointer-events-auto">
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="p-4 bg-gray-950/70 border border-white/10 rounded-lg backdrop-blur-xl">
        <h3 className="text-xs text-gray-400 font-mono uppercase tracking-widest flex items-center gap-2 font-bold mb-3">Stream Providers (Failovers)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {EMBED_PROVIDERS.map(({ key, name }) => (
            <button key={key} onClick={() => setSelectedProviderKey(key)} className={`flex items-center justify-center text-center gap-2.5 px-3 py-2.5 rounded-md border text-xs font-mono transition-all duration-200 ${selectedProviderKey === key ? "bg-rose-500/15 border-rose-500/60 text-rose-300 font-bold shadow-lg shadow-rose-950/50" : "bg-white/5 border-transparent text-gray-400 hover:border-white/20 hover:text-white"}`}>
              {selectedProviderKey === key ? <CheckCircle className="w-4 h-4 text-rose-400 flex-shrink-0" /> : <Layers className="w-4 h-4 text-gray-600 flex-shrink-0" />}
              <span className="truncate">{name}</span>
            </button>
          ))}
        </div>
      </div>

      {isTv && seasons && seasons.length > 0 && (
        <div className="p-4 bg-gray-950/70 border border-white/10 rounded-lg">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-shrink-0">
                <label htmlFor="season-select" className="text-xs text-gray-400 font-mono uppercase tracking-widest flex items-center gap-2 font-bold mb-3">Season</label>
                <select id="season-select" value={currentSeason} onChange={handleSeasonChange} className="w-full bg-black/30 border border-white/10 rounded-md px-3 py-2 text-white font-mono focus:outline-none focus:ring-2 focus:ring-rose-500">
                    {seasons.map(season => (
                        <option key={season.id} value={season.season_number}>{season.name}</option>
                    ))}
                </select>
            </div>
            <div className="flex-grow">
                <h3 className="text-xs text-gray-400 font-mono uppercase tracking-widest flex items-center gap-2 font-bold mb-3">Episodes</h3>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2 max-h-60 overflow-y-auto pr-2">
                    {Array.from({ length: episodes || 0 }, (_, i) => i + 1).map(episodeNumber => (
                        <button key={episodeNumber} onClick={() => handleEpisodeClick(episodeNumber)} className={`aspect-square rounded-md text-xs font-mono transition-all ${currentEpisode === episodeNumber ? 'bg-rose-500 text-white font-bold' : 'bg-black/30 text-gray-300 hover:bg-white/10'}`}>
                            {episodeNumber}
                        </button>
                    ))}
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 