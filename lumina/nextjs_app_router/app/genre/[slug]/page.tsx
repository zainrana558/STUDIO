
import { notFound } from 'next/navigation';
import { themes, Theme } from '../../../lib/themes';
import { getTrending, getDiscover } from '../../../lib/tmdb';
import { HeroBanner } from '../../../components/Media/HeroBanner';
import { MediaRail } from '../../../components/Media/MediaRail';
import { FilmGrain } from '../../../components/Media/FilmGrain';

type GenrePageProps = {
    params: { slug: string };
};

/**
 * The main Server Component for displaying a genre page.
 * It fetches data from TMDB and renders the page using theme-aware components.
 */
export default async function GenrePage({ params }: GenrePageProps) {
    const { slug } = params;
    const theme: Theme = themes[slug as keyof typeof themes];

    // If the slug doesn't correspond to a valid theme, show a 404 page.
    if (!theme) {
        notFound();
    }

    // Fetch all data in parallel for maximum performance.
    const [trending, discover, classics] = await Promise.all([
        getTrending('movie'),
        getDiscover(slug, 'popularity.desc'),
        getDiscover(slug, 'vote_average.desc') // For "All-Time Classics"
    ]);

    const heroMedia = trending?.[0] || discover?.[0];

    return (
        <div className="min-h-screen">
            {/* Conditionally render the FilmGrain effect only for the horror theme */}
            {slug === 'horror' && <FilmGrain />}

            {heroMedia && (
                <HeroBanner 
                    media={heroMedia} 
                    theme={theme} 
                />
            )}
            
            <div className="-mt-20 relative z-10">
                {trending && <MediaRail title={`Trending in ${theme.id}`} items={trending} theme={theme} />}
                {discover && <MediaRail title={`New ${theme.id} Releases`} items={discover} theme={theme} />}
                {classics && <MediaRail title={`All-Time ${theme.id} Classics`} items={classics} theme={theme} />}
            </div>
        </div>
    );
}
