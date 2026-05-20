"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import { Media } from '../../types/media';
import { Theme } from '../../lib/themes';

interface HeroBannerProps {
    media: Media;
    theme: Theme;
}

/**
 * A theme-aware hero banner with a parallax scroll effect.
 */
export const HeroBanner = ({ media, theme }: HeroBannerProps) => {
    const { scrollYProgress } = useScroll();
    // Create a parallax effect by transforming the y position based on scroll
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

    return (
        <div className="h-[80vh] w-full relative overflow-hidden">
            {/* Background Image with Parallax */}
            <motion.div className="absolute inset-0 z-0" style={{ y }}>
                <img
                    src={`https://image.tmdb.org/t/p/original${media.backdrop_path}`}
                    alt={media.title || media.name || ''}
                    className="w-full h-full object-cover object-center"
                />
                {/* Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-secondary)] via-transparent to-transparent" />
            </motion.div>

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-end h-full p-8 md:p-12 text-white">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ...theme.motion.bezier }}
                    className={`text-4xl md:text-6xl font-bold mb-4 ${theme.fonts.display}`}
                    style={{ color: theme.colors.primary }}
                >
                    {media.title || media.name}
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ...theme.motion.bezier }}
                    className="max-w-2xl text-lg md:text-xl text-gray-200"
                >
                    {media.overview}
                </motion.p>
            </div>
        </div>
    );
};
