import { Media } from '../types/media';
import { MediaCard } from './MediaCard';

interface MediaGridProps {
  media: Media[];
}

export const MediaGrid = ({ media }: MediaGridProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
      {media
        // Filter out any items that are not a movie or a TV show
        .filter(item => item.media_type === 'movie' || item.media_type === 'tv')
        .map((item) => (
          // Pass the specific media_type of the item to the card
          <MediaCard key={item.id} media={item} mediaType={item.media_type!} />
        ))}
    </div>
  );
};
