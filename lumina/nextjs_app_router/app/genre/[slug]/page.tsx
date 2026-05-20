
import { notFound } from 'next/navigation';
import { themes, Theme } from '../../../lib/themes';
import { getTrending, getDiscoverMovies, getDiscoverTV } from '../../../lib/tmdb';
import { HeroBanner } from '../../../components/Media/HeroBanner';
import { MediaRail } from '../../../components/Media/MediaRail';
import { FilmGrain } from '../../../components/Media/FilmGrain';

// Re-generate this page on-demand, but cache for an hour to keep it fast
export const revalidate = 3600; // 1 hour

type GenrePageProps = {
    params: { slug: string };
};

/**
 * A dynamic page for each genre, using Server Components and ISR.
 * Fetches data from TMDB and renders it with a theme-specific UI.
 */
export default async function GenrePage({ params }: GenrePageProps) {
    const { slug } = params;
    const theme: Theme = themes[slug as keyof typeof themes];

    if (!theme) {
        notFound(); // Return a 404 if the genre doesn't exist
    }

    // Fetch all necessary data in parallel for performance.
    const [trendingMovies, trendingTV, moviesByGenre, tvByGenre] = await Promise.all([
        getTrending('movie'),
        getTrending('tv'),
        getDiscoverMovies(slug, 'popularity.desc'),
        getDiscoverTV(slug, 'popularity.desc')
    ]);

    const heroMedia = trendingMovies?.[0] || moviesByGenre?.[0];

    return (
        <div className="min-h-screen" style={{ backgroundColor: theme.colors.background }}>
            {slug === 'horror' && <FilmGrain strength={0.07} opacity={0.15} />}

            {heroMedia && (
                <HeroBanner 
                    media={heroMedia} 
                    theme={theme} 
                />
            )}
            
            {/* Offset the main content to overlap with the hero banner */}
            <div className="-mt-24 md:-mt-32 relative z-10">
                {trendingMovies && <MediaRail title={`Trending Movies`} items={trendingMovies} theme={theme} />}
                {trendingTV && <MediaRail title={`Trending TV Shows`} items={trendingTV} theme={theme} />}
                {moviesByGenre && <MediaRail title={`New ${theme.name} Movies`} items={moviesByGenre} theme={theme} />}
                {tvByGenre && <MediaRail title={`New ${theme.name} TV Shows`} items={tvByGenre} theme={theme} />}
            </div>
        </div>
    );
}
