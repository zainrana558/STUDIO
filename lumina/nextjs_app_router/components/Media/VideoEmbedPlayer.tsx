"use client";

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MediaDetails } from '../../types/media';

interface VideoEmbedPlayerProps {
    media: MediaDetails;
}

const servers = [
    { name: 'VidSrc', key: 'vidsrc' },
    { name: 'NexStream', key: 'nexstream' },
    { name: 'VidPhantom', key: 'vidphantom' },
    { name: '2Embed', key: '2embed' },
];

export const VideoEmbedPlayer = ({ media }: VideoEmbedPlayerProps) => {
    const [activeServer, setActiveServer] = useState(servers[0].key);
    const [activeSeason, setActiveSeason] = useState(1);
    const [activeEpisode, setActiveEpisode] = useState(1);

    const streamUrl = useMemo(() => {
        const { media_type, id, imdb_id } = media;
        
        switch (activeServer) {
            case 'vidsrc':
                if (media_type === 'tv') {
                    return `https://vidsrc.cc/v2/embed/tv/${id}/${activeSeason}/${activeEpisode}`;
                }
                return `https://vidsrc.cc/v2/embed/movie/${id}`;
            case '2embed':
                 if (media_type === 'tv') {
                    return `https://www.2embed.cc/embed_tv?id=${id}&s=${activeSeason}&e=${activeEpisode}`;
                }
                return `https://www.2embed.cc/embed/${imdb_id}`;
             // Fallback for other servers - using TMDB ID as a placeholder
            case 'nexstream':
            case 'vidphantom':
                 if (media_type === 'tv') {
                     return `https://vidsrc.me/embed/${id}/${activeSeason}-${activeEpisode}/`;
                 }
                 return `https://vidsrc.me/embed/${id}/`;
            default:
                return '';
        }
    }, [media, activeServer, activeSeason, activeEpisode]);

    return (
        <div className="w-full">
            {/* --- Video Player and Controls -- */}
            <div className="aspect-video bg-black relative">
                <AnimatePresence mode="wait">
                    <motion.iframe
                        key={streamUrl} // Force re-render on URL change
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 } }
                        src={streamUrl}
                        className="w-full h-full absolute top-0 left-0"
                        frameBorder="0"
                        allowFullScreen
                        sandbox="allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation"
                    />
                </AnimatePresence>
            </div>

            {/* --- Server Selector -- */}
            <div className="bg-gray-900 p-4 flex flex-wrap items-center justify-center space-x-2">
                {servers.map(server => (
                    <button
                        key={server.key}
                        onClick={() => setActiveServer(server.key)}
                        className={`px-4 py-2 text-sm rounded-md transition-colors ${activeServer === server.key ? 'bg-red-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>
                        {server.name}
                    </button>
                ))}
            </div>

            {/* --- TV Show Episode Selector -- */}
            {media.media_type === 'tv' && media.seasons && (
                <div className="p-4 md:p-8">
                    {/* Season Tabs */}
                    <div className="flex space-x-2 border-b border-gray-700 mb-4">
                        {media.seasons.map(season => (
                            <button 
                                key={season.id} 
                                onClick={() => setActiveSeason(season.season_number)}
                                className={`pb-2 px-4 ${activeSeason === season.season_number ? 'border-b-2 border-red-500 text-white' : 'text-gray-400'}`}>
                                Season {season.season_number}
                            </button>
                        ))}
                    </div>
                    
                    {/* Episode Grid */}
                    <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-12 gap-2">
                        {Array.from({ length: media.seasons.find(s => s.season_number === activeSeason)?.episode_count || 0 }, (_, i) => i + 1).map(episode => (
                            <button 
                                key={episode} 
                                onClick={() => setActiveEpisode(episode)}
                                className={`aspect-square rounded-md transition-colors ${activeEpisode === episode ? 'bg-red-600' : 'bg-gray-800 hover:bg-gray-700'}`}>
                                {episode}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
