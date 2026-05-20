"use client";

import React, { useState, useEffect } from "react";
import { 
  Play, 
  Server, 
  Tv, 
  CheckCircle, 
  AlertTriangle, 
  Loader2, 
  Layers, 
  Maximize, 
  Minimize,
  Sparkles,
  ChevronRight,
  Volume2,
  Volume1,
  VolumeX
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { MediaDetails } from "../types/media";

interface VideoEmbedPlayerProps {
  id: number;
  media_type: "movie" | "tv";
  details?: MediaDetails | null;
}

interface EmbedProvider {
  name: string;
  url: string;
}

export const VideoEmbedPlayer: React.FC<VideoEmbedPlayerProps> = ({ id, media_type, details }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedProviderIdx, setSelectedProviderIdx] = useState(0);

  // TV show specific grids
  const isTv = media_type === "tv";
  const numSeasons = details?.number_of_seasons || 1;
  const numEpisodes = details?.number_of_episodes || 10;

  const [currentSeason, setCurrentSeason] = useState(1);
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Volume state persistence with graceful errors
  const [volume, setVolume] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("lumina-player-volume");
      return saved ? Number(saved) : 80;
    } catch {
      return 80;
    }
  });

  const [isMuted, setIsMuted] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("lumina-player-muted");
      return saved === "true";
    } catch {
      return false;
    }
  });

  const [prevVolume, setPrevVolume] = useState<number>(80);

  const handleMuteToggle = () => {
    if (isMuted) {
      setIsMuted(false);
      try {
        localStorage.setItem("lumina-player-muted", "false");
      } catch {}
    } else {
      setPrevVolume(volume);
      setIsMuted(true);
      try {
        localStorage.setItem("lumina-player-muted", "true");
      } catch {}
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (val > 0 && isMuted) {
      setIsMuted(false);
      try {
        localStorage.setItem("lumina-player-muted", "false");
      } catch {}
    }
    try {
      localStorage.setItem("lumina-player-volume", String(val));
    } catch {}
  };

  // Failover architecture URL mapping
  const getProviders = (): EmbedProvider[] => {
    const s = String(currentSeason);
    const e = String(currentEpisode);
    return [
      {
        name: "VidSrc (Primary)",
        url: media_type === "movie"
          ? `https://vidsrc.to/embed/movie/${id}`
          : `https://vidsrc.to/embed/tv/${id}/${s}/${e}`
      },
      {
        name: "NexStream (Failover A)",
        url: media_type === "movie"
          ? `https://nexstream.site/embed/movie/${id}?signature=lumina_prod_secure_key_5521&ref=lumina`
          : `https://nexstream.site/embed/tv/${id}/${s}/${e}?signature=lumina_prod_secure_key_5521&ref=lumina`
      },
      {
        name: "VidPhantom (Failover B)",
        url: media_type === "movie"
          ? `https://vidphantom.com/embed/movie/${id}`
          : `https://vidphantom.com/embed/tv/${id}/${s}/${e}`
      },
      {
        name: "2Embed (Failover C)",
        url: media_type === "movie"
          ? `https://www.2embed.cc/embed/${id}`
          : `https://www.2embed.cc/embed_tv?id=${id}&s=${s}&e=${e}&season=${s}&episode=${e}`
      }
    ];
  };

  const providers = getProviders();
  const activeUrl = providers[selectedProviderIdx]?.url || "";

  // Reset loading whenever episode/server/season changes to prevent flash-of-unrendered-states
  useEffect(() => {
    setLoading(true);
    setError(false);
  }, [currentSeason, currentEpisode, selectedProviderIdx, id, media_type]);

  const handleProviderSwap = (idx: number) => {
    setSelectedProviderIdx(idx);
  };

  const handleFullscreenToggle = () => {
    const container = document.getElementById("lumina-embedded-player-container");
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch((err) => console.warn("Fullscreen permission blocked inside sandbox context", err));
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full select-none">
      
      {/* 1. Outer stage container with cinema vibes */}
      <div 
        id="lumina-embedded-player-container"
        className="relative w-full aspect-video rounded-2xl bg-[#080a0e] border border-white/5 overflow-hidden shadow-2xl group"
      >
        <iframe
          id="lumina-cinema-frame"
          src={activeUrl}
          title="Luminaa2 Secure Stream Player"
          className="w-full h-full border-0 absolute inset-0 z-10 transition-opacity duration-350"
          // Mandatory high-compatibility sandbox
          sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-pointer-lock"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          frameBorder="0"
          onLoad={() => setLoading(false)}
          onError={() => setError(true)}
        />

        {/* Dynamic Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center gap-3.5 z-20">
            <Loader2 className="w-9 h-9 text-rose-500 animate-spin" />
            <div className="text-center font-mono select-none">
              <span className="text-xs font-bold text-gray-200 tracking-wider block uppercase">Connecting Bridge Channel...</span>
              <span className="text-[10px] text-gray-500 block uppercase mt-1">Provider: {providers[selectedProviderIdx]?.name}</span>
            </div>
          </div>
        )}

        {/* Connection Failure Error screen */}
        {error && (
          <div className="absolute inset-0 bg-[#090b0e] flex flex-col items-center justify-center p-6 text-center gap-4 z-20">
            <AlertTriangle className="w-10 h-10 text-rose-500 animate-pulse" />
            <div className="max-w-md">
              <h3 className="text-sm font-bold font-mono text-white uppercase tracking-widest">Stream Synch Decoupled</h3>
              <p className="text-xs text-gray-400 mt-1">
                The targeted embed address could not be linked securely. Swap to an alternate failover provider index below or retry link nodes.
              </p>
            </div>
            <button 
              onClick={() => { setLoading(true); setError(false); }}
              className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 font-mono text-xs font-bold rounded-lg text-white transition-all active:scale-95 cursor-pointer"
            >
              Force Node Retry
            </button>
          </div>
        )}

        {/* Minimal Float HUD Controls */}
        <div className="absolute top-4 left-4 right-4 z-15 flex justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="px-3 py-1.5 rounded-lg bg-black/85 border border-white/10 flex items-center gap-1.5 backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-[9px] text-gray-300 font-mono font-bold uppercase tracking-wider">
              {isTv ? `Season ${currentSeason} : Episode ${currentEpisode}` : "Movie Projection"}
            </span>
          </div>

          <button 
            type="button"
            onClick={handleFullscreenToggle}
            className="p-1.5 rounded-lg bg-black/85 border border-white/10 hover:border-white/20 text-gray-400 hover:text-white transition-all backdrop-blur-md pointer-events-auto cursor-pointer"
            title="Cinema Fullscreen Mode"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>

        {/* Floating Bottom HUD Player HUD with Volume Controls */}
        <div className="absolute bottom-4 left-4 right-4 z-15 flex justify-between items-center pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300">
          {/* Bottom Left: Audio Feedback Indicator */}
          <div className="px-3 py-1.5 rounded-lg bg-black/85 border border-white/10 flex items-center gap-1.5 backdrop-blur-md pointer-events-auto">
            <span className="text-[9px] text-gray-400 font-mono tracking-wider font-bold uppercase">
              AUDIO PREFERENCES
            </span>
          </div>

          {/* Bottom Right: Interactive Volume Deck */}
          <div className="px-3 py-1.5 rounded-lg bg-black/85 border border-white/10 flex items-center gap-2.5 backdrop-blur-md pointer-events-auto shadow-xl">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleMuteToggle}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer p-0.5 focus:outline-none"
                title={isMuted ? "Unmute Sound" : "Mute Sound"}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-rose-500" />
                ) : volume <= 50 ? (
                  <Volume1 className="w-4 h-4 text-rose-400" />
                ) : (
                  <Volume2 className="w-4 h-4 text-rose-500" />
                )}
              </button>

              <div className="relative flex items-center w-16 sm:w-24">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-full h-1 rounded-lg appearance-none cursor-pointer focus:outline-none accent-rose-500"
                  style={{
                    background: `linear-gradient(to right, #f43f5e 0%, #f43f5e ${isMuted ? 0 : volume}%, rgba(255, 255, 255, 0.2) ${isMuted ? 0 : volume}%, rgba(255, 255, 255, 0.2) 100%)`
                  }}
                  title={`Volume: ${isMuted ? 0 : volume}%`}
                />
              </div>

              <span className="text-[10px] text-gray-300 font-mono font-bold w-8 text-right shrink-0">
                {isMuted ? "0" : volume}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Failover Selector & Interactive Provider Deck */}
      <div className="flex flex-col gap-3 py-1 border-t border-b border-white/5 bg-gray-950/10 p-4 rounded-xl">
        <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest text-left flex items-center gap-1.5 font-bold">
          <Server className="w-3.5 h-3.5 text-rose-500" />
          Active Bridge Signatures (Failover Servers)
        </span>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {providers.map((prov, idx) => (
            <button
              key={prov.name}
              onClick={() => handleProviderSwap(idx)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-[11px] font-mono transition-all duration-300 cursor-pointer ${
                selectedProviderIdx === idx
                  ? "bg-rose-500/10 border-rose-500/40 text-rose-400 font-bold"
                  : "bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {selectedProviderIdx === idx ? (
                <CheckCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              ) : (
                <Layers className="w-3.5 h-3.5 text-gray-500 shrink-0" />
              )}
              <span className="truncate">{prov.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Reactive Season Tabs & Interactive Episode Index Grid */}
      {isTv && (
        <div className="flex flex-col gap-3.5 p-5 bg-[#0e1116]/80 rounded-2xl border border-white/5 text-left">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <Tv className="w-4.5 h-4.5 text-rose-500" />
              <h4 className="text-xs font-bold font-mono text-white uppercase tracking-wider">
                Episodic Grid Directory
              </h4>
            </div>

            {/* Quick Season Deck Dropdown */}
            <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-2 py-1">
              <span className="text-[9px] text-gray-500 font-mono uppercase tracking-wider font-bold">Season:</span>
              <select
                value={currentSeason}
                onChange={(e) => {
                  setCurrentSeason(Number(e.target.value));
                  setCurrentEpisode(1); // auto cycle back to ep 1 on scale shift
                }}
                className="bg-transparent border-0 font-mono text-xs font-bold text-rose-400 outline-none cursor-pointer focus:ring-0 pr-1"
              >
                {Array.from({ length: numSeasons }, (_, idx) => (
                  <option key={idx + 1} value={idx + 1} className="bg-[#0c0d12] text-white font-mono">
                    Season {idx + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Staggered Episode cards mapped using smooth spring transforms */}
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-[170px] overflow-y-auto pr-1">
            {Array.from({ length: Math.ceil(numEpisodes / numSeasons) }, (_, i) => {
              const epNum = i + 1;
              const isCurrent = currentEpisode === epNum;
              return (
                <motion.button
                  key={epNum}
                  onClick={() => setCurrentEpisode(epNum)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`py-2 rounded-xl border font-mono transition-all text-center flex flex-col justify-center items-center cursor-pointer ${
                    isCurrent
                      ? "bg-gradient-to-tr from-rose-500/20 to-purple-550/15 border-rose-500 text-white font-black"
                      : "bg-white/2 border-white/5 text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className="text-[8px] text-gray-500 uppercase leading-none mb-0.5 font-bold">EP</span>
                  <span className="text-xs leading-none">{epNum}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};