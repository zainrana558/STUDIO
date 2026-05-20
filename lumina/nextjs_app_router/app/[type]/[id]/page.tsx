import { getMediaDetails } from "../../../lib/tmdb";
import { MediaDetails } from "../../../types/media";
import { VideoEmbedPlayer } from "../../../components/VideoEmbedPlayer";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Star } from "lucide-react";
import { MediaGrid } from "../../../components/MediaGrid";

interface DetailPageProps {
  params: {
    type: "movie" | "tv";
    id: string;
  };
}

const getImageUrl = (path: string | null, quality: "original" | "w500" = "w500") => {
    return path ? `https://image.tmdb.org/t/p/${quality}${path}` : '/placeholder.svg';
}

export async function generateMetadata({ params }: DetailPageProps) {
  try {
    const details: MediaDetails = await getMediaDetails(params.type, params.id);
    const title = details.title || details.name;
    return {
      title: `${title} | Lumina`,
      description: details.overview,
    };
  } catch {
    return {
      title: "Not Found | Lumina",
    };
  }
}

export default async function DetailPage({ params }: DetailPageProps) {
  if (params.type !== "movie" && params.type !== "tv") {
    notFound();
  }

  let details: MediaDetails;
  try {
    details = await getMediaDetails(params.type, params.id);
  } catch (error) {
    notFound();
  }

  const title = details.title || details.name;
  const releaseYear = details.release_date
    ? new Date(details.release_date).getFullYear()
    : details.first_air_date
    ? new Date(details.first_air_date).getFullYear()
    : "N/A";

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative -mt-16 h-[60vh] md:h-[80vh] w-full">
        <div className="absolute inset-0">
            <Image
                src={getImageUrl(details.backdrop_path, 'original')}
                alt={`Backdrop for ${title}`}
                fill
                priority
                className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
        </div>
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-end pb-12 text-white">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter">{title}</h1>
            <div className="flex items-center gap-4 mt-2 text-gray-300">
                <span>{releaseYear}</span>
                <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-400" />
                    <span>{details.vote_average.toFixed(1)}</span>
                </div>
                {details.runtime && <span>{Math.floor(details.runtime / 60)}h {details.runtime % 60}m</span>}
                {details.number_of_seasons && <span>{details.number_of_seasons} Season(s)</span>}
            </div>
            <p className="mt-4 max-w-2xl text-sm md:text-base text-gray-200">{details.overview}</p>
        </div>
      </section>

      {/* Player & Details Section */}
      <section className="container mx-auto px-4">
        <VideoEmbedPlayer id={details.id} media_type={params.type} details={details} />
      </section>

      {/* Recommendations */}
      {details.recommendations?.results?.length > 0 && (
          <section className="container mx-auto px-4">
              <h2 className="text-2xl font-bold mb-4 text-white">More Like This</h2>
              <MediaGrid media={details.recommendations.results} />
          </section>
      )}
    </div>
  );
}
