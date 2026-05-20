import { getTrending } from "../lib/tmdb";
import { HomeView } from "../components/HomeView";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { Suspense } from "react";

export const revalidate = 3600; // Revalidate trending data every hour

export default async function HomePage() {
  const initialTrending = await getTrending("all");

  return (
    <main className="container mx-auto px-4 py-8">
      <Suspense fallback={<LoadingSkeleton message='Loading trending titles...' />}>
        <HomeView initialTrending={initialTrending.results} />
      </Suspense>
    </main>
  );
}
