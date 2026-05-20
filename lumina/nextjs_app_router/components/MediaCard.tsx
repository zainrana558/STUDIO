'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Media } from '../types/media';
import { useTheme } from './ThemeProvider';

interface MediaCardProps {
  media: Media;
  mediaType: 'movie' | 'tv';
}

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export const MediaCard = ({ media, mediaType }: MediaCardProps) => {
  const { theme } = useTheme();

  const title = media.title || media.name || 'Untitled';
  const releaseDate = media.release_date || media.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';

  return (
    <Link href={`/${mediaType}/${media.id}`} passHref>
      <motion.div
        className="relative overflow-hidden rounded-lg shadow-lg group"
        style={{ borderColor: theme.colors.accent, color: theme.colors.primary }}
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }}
        whileHover="hover"
      >
        {/* Zero-Bandwidth Image with CLS Protection */}
        <div className="aspect-[2/3] bg-gray-900/50">
          {media.poster_path ? (
            <img
              src={`${TMDB_IMAGE_BASE_URL}${media.poster_path}`}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-xs text-gray-500">No Image</p>
            </div>
          )}
        </div>

        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 flex flex-col justify-end"
          variants={{
            hover: {
              backgroundColor: `rgba(0,0,0,0.7)`,
            },
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.h3 
            className={`text-lg font-bold ${theme.fonts.display}`} 
            style={{ color: theme.colors.primary }}
          >
            {title}
          </motion.h3>
          <div className="flex items-center justify-between text-xs mt-1">
            <span>{year}</span>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3" style={{ color: theme.colors.accent }} />
              <span>{media.vote_average.toFixed(1)}</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </Link>
  );
};
