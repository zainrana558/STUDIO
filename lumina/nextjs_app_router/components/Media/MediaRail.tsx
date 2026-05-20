"use client";

import { motion } from 'framer-motion';
import { Media } from '../../types/media';
import { Theme } from '../../lib/themes';
import { MediaCard } from './MediaCard';

interface MediaRailProps {
    title: string;
    items: Media[];
    theme: Theme;
}

/**
 * A horizontal, scrollable rail for displaying a list of media.
 */
export const MediaRail = ({ title, items, theme }: MediaRailProps) => {
    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.1, // Stagger the animation of each card
            },
        },
    };

    return (
        <div className="py-8">
            <h2 className={`text-2xl font-bold px-8 mb-4 ${theme.fonts.display}`} style={{ color: theme.colors.primary }}>{title}</h2>
            <div className="overflow-x-auto pb-4 scrollbar-hide">
                <motion.div
                    className="flex space-x-4 px-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {items.map((item) => (
                        <div key={item.id} className="w-40 md:w-48 flex-shrink-0">
                            <MediaCard item={item} theme={theme} />
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};
