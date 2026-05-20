import { MediaGrid } from '../../../components/MediaGrid';
import { Media } from '../../../types/media';

async function fetchMediaByGenre(genreSlug: string): Promise<Media[]> {
  // In a real application, you would map the slug to a TMDB genre ID
  // For now, we'll just use a generic discovery endpoint
  const res = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1`);
  const data = await res.json();
  return data.results;
}

export default async function GenrePage({ params }: { params: { slug: string } }) {
  const media = await fetchMediaByGenre(params.slug);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 capitalize" style={{ fontFamily: 'var(--font-orbitron)' }}>
        {params.slug} Movies
      </h1>
      <MediaGrid media={media} mediaType="movie" />
    </div>
  );
}
