"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

/**
 * Provides a "Cinema Shutter" page transition effect.
 * Slides in from the top and bottom to cover the page, then reveals the new content.
 */
export const PageTransition = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();

    const shutterVariants = {
        initial: { y: '-100%' },
        animate: { y: '0%' },
        exit: { y: '100%' },
    };

    return (
        <AnimatePresence mode="wait" initial={false}>
            <motion.div key={pathname}>
                {children}
                
                <motion.div 
                    className="fixed top-0 left-0 w-full h-1/2 bg-[var(--color-secondary, #0F172A)] z-50"
                    variants={shutterVariants}
                    initial="initial"
                    animate="exit"
                    exit="initial"
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                />
                <motion.div 
                    className="fixed bottom-0 left-0 w-full h-1/2 bg-[var(--color-secondary, #0F172A)] z-50"
                    variants={shutterVariants}
                    initial={{ y: '100%' }}
                    animate={{ y: '-100%' }}
                    exit={{ y: '100%' }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                />
            </motion.div>
        </AnimatePresence>
    );
};
