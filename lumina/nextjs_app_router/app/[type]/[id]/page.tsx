
import { notFound } from 'next/navigation';
import { getMediaDetails } from '../../../lib/tmdb';
import { VideoEmbedPlayer } from '../../../components/Media/VideoEmbedPlayer';
import { MediaDetails } from '../../../types/media';

type MediaPageProps = {
    params: { 
        type: 'movie' | 'tv';
        id: string;
     };
};

/**
 * Server Component for the media details page.
 * Fetches all necessary data server-side for optimal performance and SEO.
 */
export default async function MediaPage({ params }: MediaPageProps) {
    const { type, id } = params;

    if (type !== 'movie' && type !== 'tv') {
        notFound();
    }

    const mediaDetails: MediaDetails | null = await getMediaDetails(type, id);

    if (!mediaDetails) {
        notFound();
    }

    return (
        <div className="bg-black min-h-screen text-white">
             <VideoEmbedPlayer media={mediaDetails} />
        </div>
    );
}
 