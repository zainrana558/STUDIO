
import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";

const ALLOWED_PATHS = [
  /^search\/multi$/,
  /^trending\/all\/week$/,
  /^movie\/[0-9]+$/,
  /^tv\/[0-9]+$/,
];

const ratelimit = new Ratelimit({
  redis: kv,
  // 5 requests from the same IP in 10 seconds
  limiter: Ratelimit.slidingWindow(5, "10s"),
});

function isAllowed(path: string) {
  return ALLOWED_PATHS.some((regex) => regex.test(path));
}

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join("/");
  const { searchParams } = new URL(request.url);
  const ip = request.ip ?? "127.0.0.1";

  const { success, pending, limit, reset, remaining } = await ratelimit.limit(
    `ratelimit_tmdb_${ip}`
  );

  if (!success) {
    return NextResponse.json(
      { message: "Too many requests. Please try again later." },
      { status: 429, statusText: "Too Many Requests" }
    );
  }

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

  const queryString = Array.from(searchParams.entries())
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  const tmdbUrl = `https://api.themoviedb.org/3/${path}?api_key=${TMDB_API_KEY}&${queryString}`;

  try {
    const tmdbResponse = await fetch(tmdbUrl, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!tmdbResponse.ok) {
      const errorBody = await tmdbResponse.json();
      return NextResponse.json(errorBody, {
        status: tmdbResponse.status,
        statusText: tmdbResponse.statusText,
      });
    }

    const data = await tmdbResponse.json();
    return NextResponse.json(data);
  } catch (error) {
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
