import { getTrending } from "../lib/tmdb";
import { HomeView } from "../components/HomeView";
import { Suspense } from "react";

export const revalidate = 3600; // Revalidate trending data every hour

export default async function HomePage() {
  const initialTrending = await getTrending("all");

  return (
    <main className="container mx-auto px-4 py-8">
      <Suspense fallback={<div className="text-center">Loading...</div>}>
        <HomeView initialTrending={initialTrending.results} />
      </Suspense>
    </main>
  );
}
