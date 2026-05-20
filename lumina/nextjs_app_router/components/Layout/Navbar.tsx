"use client";

import { Logo } from './Logo';
import { Magnetic } from './Magnetic';
import Link from 'next/link';

const navLinks = [
    { name: 'Anime', href: '/genre/anime' },
    { name: 'Cartoons', href: '/genre/cartoons' },
    { name: 'Sci-Fi', href: '/genre/scifi' },
    { name: 'Horror', href: '/genre/horror' },
];

/**
 * The main application navigation bar. Fixed at the top of the viewport.
 */
export const Navbar = () => {
    return (
        <header className="fixed top-0 left-0 right-0 z-40 bg-transparent">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                <Logo />
                <div className="flex items-center gap-4">
                    {navLinks.map((link) => (
                        <Magnetic key={link.href}>
                            <Link href={link.href} className="px-3 py-2 text-sm font-bold text-gray-300 hover:text-white transition-colors duration-300">
                                {link.name}
                            </Link>
                        </Magnetic>
                    ))}
                </div>
            </nav>
        </header>
    );
};
