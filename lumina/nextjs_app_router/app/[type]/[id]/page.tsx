import React from "react";
import Link from "next/link";
import { ArrowLeft, Star, Clock, Calendar, ShieldCheck, Heart, Sparkles, User, Users } from "lucide-react";
import { VideoEmbedPlayer } from "../../../components/VideoEmbedPlayer";
import { ShareButton } from "../../../components/ShareButton";
import { MediaDetails, MediaItem } from "../../../types/media";

// TMDB server helper fetching using secure background variables
async function fetchDetailsFromServer(type: string, id: string): Promise<MediaDetails | null> {
  const apiKey = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY;
  if (!apiKey || apiKey === "your_api_key_here") {
    // If unconfigured, return null to activate curated cinematic fallback objects
    return null;
  }

  try {
    const url = `https://api.themoviedb.org/3/${type}/${id}?api_key=${apiKey}&append_to_response=credits,recommendations`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("TMDB Core backend fetch exception:", err);
    return null;
  }
}

interface PageProps {
  params: Promise<{
    type: string;
    id: string;
  }>;
}

export default async function NextJSMediaPlayerPage({ params }: PageProps) {
  const resolvedParams = await params;
  const mediaType = resolvedParams.type === "tv" ? "tv" : "movie";
  const mediaIdStr = resolvedParams.id;
  const mediaId = Number(mediaIdStr) || 12345;

  // 1. Fetch metadata server-side
  let details = await fetchDetailsFromServer(mediaType, mediaIdStr);

  // 2. High-fidelity dynamic fallback details if official API lacks connection
  if (!details) {
    details = {
      id: mediaId,
      media_type: mediaType,
      title: mediaType === "movie" ? "Chronos Legacy Redux" : "Cosmic Odyssey Series",
      name: mediaType === "tv" ? "Cosmic Odyssey Series" : "Chronos Legacy Redux",
      overview: "An immersive cinematic masterpiece set inside raw cyberspace boundaries. Featuring high-contrast dark visual tones, reactive motion grids, and ultra-secure failover streaming targets.[...]",
      poster_path: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?q=80&w=500&auto=format&fit=crop",
      backdrop_path: "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?q=80&w=1200&auto=format&fit=crop",
      vote_average: 8.8,
      release_date: "2026-05-15",
      first_air_date: "2026-03-10",
      tagline: "The boundary is merely another transition.",
      status: "Released",
      runtime: mediaType === "movie" ? 148 : undefined,
      number_of_seasons: mediaType === "tv" ? 3 : undefined,
      number_of_episodes: mediaType === "tv" ? 24 : undefined,
      genres: [
        { id: 878, name: "Sci-Fi" },
        { id: 28, name: "Action" },
        { id: 18, name: "Drama" }
      ],
      credits: {
        cast: [
          { id: 301, name: "Alexander Sterling", character: "Lead Pilot", profile_path: null },
          { id: 302, name: "Elena Vostok", character: "AI Coordinator", profile_path: null },
          { id: 303, name: "James Vance", character: "Tactical Engineer", profile_path: null }
        ]
      }
    };
  }

  const durationLabel = details.runtime 
    ? `${details.runtime} mins` 
    : details.number_of_seasons 
      ? `${details.number_of_seasons} Seasons (${details.number_of_episodes || 0} Episodes)`
      : "128 mins";

  const titleText = details.title || details.name || details.original_title || "Luminaa Screen";
  const releaseYear = details.release_date 
    ? details.release_date.split("-")[0] 
    : details.first_air_date 
      ? details.first_air_date.split("-")[0] 
      : "2026";

  const bannerUrl = details.backdrop_path.startsWith("http") 
    ? details.backdrop_path 
    : `https://image.tmdb.org/t/p/original${details.backdrop_path}`;

  return (
    <div className="min-h-screen bg-[#07090c] text-gray-100 font-sans pb-24 relative overflow-hidden">
      
      {/* Sleek aesthetic ambient backdrop blur */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-5%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[140px] bg-rose-500/5" />
        <div className="absolute bottom-[-5%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[140px] bg-purple-500/5" />
        {bannerUrl && (
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center opacity-10 filter blur-[100px] scale-110"
            style={{ backgroundImage: `url(${bannerUrl})` }}
          />
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 relative z-10 flex flex-col gap-6">
        
        {/* Navigation back ribbon bar */}
        <header className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <Link 
              href={`/genre/${mediaType === "movie" ? "scifi" : "anime"}`}
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 text-xs font-mono font-bold uppercase tracking-wider [...]"
            >
              <ArrowLeft className="w-4 h-4 text-rose-500" />
              Back to Aesthetic Feed
            </Link>
            <ShareButton />
          </div>
          <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono uppercase tracking-widest hidden sm:flex">
            <span className="text-emerald-400 font-bold block bg-emerald-500/5 border border-emerald-500/20 px-2 py-0.5 rounded">
              Status Live
            </span>
            <span>ID: {mediaId}</span>
          </div>
        </header>

        {/* Secure failover dynamic media player */}
        <section id="lumina-integrated-player-frame">
          <VideoEmbedPlayer id={mediaId} media_type={mediaType} details={details} />
        </section>

        {/* Unified metadata informational details block */}
        <section id="media-metadata-view" className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2 text-left">
          
          {/* Main Info Box (2 Columns) */}
          <div className="lg:col-span-2 flex flex-col gap-4.5 bg-white/[0.02] border border-white/5 rounded-2xl p-6 relative overflow-hidden backdrop-blur-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/30 text-[9px] font-mono tracking-widest font-bold text-rose-400 uppercase leading-none">
                {details.status || "Live Projection"}
              </span>
              <span className="flex items-center gap-1 text-xs text-yellow-500 font-bold pl-2 border-l border-white/5">
                <Star className="w-4 h-4 fill-current text-yellow-500" />
                {details.vote_average.toFixed(1)} / 10
              </span>
              <span className="text-gray-400 text-xs pl-2 border-l border-white/5 flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-rose-500" />
                {durationLabel}
              </span>
              <span className="text-gray-400 text-xs pl-2 border-l border-white/5 flex items-center gap-1 font-mono">
                <Calendar className="w-3.5 h-3.5 text-purple-500" />
                {releaseYear}
              </span>
            </div>

            <h1 className="text-2xl md:text-3.5xl font-black uppercase tracking-tight text-white mt-1 leading-none">
              {titleText}
            </h1>

            {details.tagline && (
              <p className="text-xs font-serif italic text-rose-400 leading-none">
                "{details.tagline}"
              </p>
            )}

            <p className="text-sm text-gray-300 leading-relaxed font-sans mt-1 pb-4 border-b border-white/5">
              {details.overview || "This feature release deep-dives in the retro cinematic cybernetic ecosystem. Connect safe streams to enjoy multi-quality indices."}
            </p>

            {/* Tags area */}
            <div className="flex flex-col gap-2">
              <span className="text-[9px] text-gray-500 font-mono tracking-widest uppercase font-bold">Genre Indexes</span>
              <div className="flex flex-wrap gap-2">
                {details.genres?.map((g) => (
                  <span 
                    key={g.id}
                    className="px-2.5 py-1 text-[10px] font-mono rounded bg-white/5 border border-white/5 text-gray-300 hover:text-white transition-all"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Cast Lists & Security Side block */}
          <div className="flex flex-col gap-4 bg-white/[0.02] border border-white/5 rounded-2xl p-6 backdrop-blur-3xl">
            
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1.5 border-b border-white/5 pb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Luminaa Security Shielded
            </h3>

            <div className="py-2.5 px-3.5 rounded-xl bg-black/40 border border-white/5 text-[11px] font-mono text-gray-400 leading-relaxed">
              Sandbox shielding acts to dynamically block invasive redirect attempts and malicious popups, ensuring pristine cinema.
            </div>

            {/* Top Cast Members panel */}
            <div className="flex flex-col gap-3 mt-2">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5 border-b border-white/5 pb-1.5">
                <Users className="w-4 h-4 text-purple-400" />
                Featured Casting
              </h4>

              <div className="flex flex-col gap-2.5 max-h-[150px] overflow-y-auto pr-1">
                {details.credits?.cast && details.credits.cast.length > 0 ? (
                  details.credits.cast.slice(0, 4).map((actor) => (
                    <div key={actor.id} className="flex items-center gap-3 border-b border-white/2 pb-1.5 last:border-0 last:pb-0">
                      <div className="w-7.5 h-7.5 rounded-full bg-gray-900 border border-white/10 overflow-hidden flex items-center justify-center font-mono text-[9px] text-rose-400 font-bold uppercase">
                        {actor.name.charAt(0)}
                      </div>
                      <div className="flex flex-col text-left min-w-0 leading-none">
                        <span className="text-xs font-bold text-gray-200 truncate">{actor.name}</span>
                        <span className="text-[10px] text-gray-500 font-mono truncate mt-0.5">{actor.character}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-[10px] font-mono text-gray-500 uppercase py-3">No cast members indexed.</div>
                )}
              </div>
            </div>

          </div>

        </section>

      </div>
    </div>
  );
}