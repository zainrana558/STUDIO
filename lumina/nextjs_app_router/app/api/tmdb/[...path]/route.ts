import { NextRequest, NextResponse } from "next/server";

// A highly-specific allowlist of API endpoints that we want to proxy.
// This is a security measure to prevent abuse of the proxy.
const ALLOWED_PATHS = [
  /^search\/multi$/,
  /^trending\/all\/week$/,
  /^movie\/[0-9]+$/,
  /^tv\/[0-9]+$/,
];

// Helper function to check if a given path is in our allowlist.
// This is more complex than a simple array lookup because we need
// to support dynamic paths like /movie/123, so we use regex.
function isAllowed(path: string) {
  return ALLOWED_PATHS.some((regex) => regex.test(path));
}

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join("/");
  const { searchParams } = new URL(request.url);

  if (!isAllowed(path)) {
    return NextResponse.json(
      { message: "This endpoint is not allowed." },
      { status: 403, statusText: "Forbidden" }
    );
  }

  const TMDB_API_KEY = process.env.TMDB_API_KEY;
  if (!TMDB_API_KEY) {
    return NextResponse.json(
      { message: "TMDB API key is not configured." },
      { status: 500, statusText: "Internal Server Error" }
    );
  }

  // We need to reconstruct the query string, but without the Next.js-
  // specific `path` parameter. This is safe because we've already
  // validated the path against our allowlist.
  const queryString = Array.from(searchParams.entries())
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  const tmdbUrl = `https://api.themoviedb.org/3/${path}?api_key=${TMDB_API_KEY}&${queryString}`;

  try {
    const tmdbResponse = await fetch(tmdbUrl, {
      headers: {
        "Content-Type": "application/json",
      },
      // Note: We are deliberately not revalidating this at the proxy 
      // level, but at the page level. This is because the proxy is a 
      // generic endpoint, and we want to allow different pages to have 
      // different revalidation strategies.
    });

    if (!tmdbResponse.ok) {
      const errorBody = await tmdbResponse.json();
      console.error(`[TMDB PROXY] Error from TMDB API for ${path}:`, errorBody);
      return NextResponse.json(errorBody, {
        status: tmdbResponse.status,
        statusText: tmdbResponse.statusText,
      });
    }

    const data = await tmdbResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`[TMDB PROXY] Internal error for ${path}:`, error);
    const message =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return NextResponse.json(
      {
        message: `Failed to fetch data from TMDB.`,
        error: message,
      },
      { status: 500, statusText: "Internal Server Error" }
    );
  }
}
