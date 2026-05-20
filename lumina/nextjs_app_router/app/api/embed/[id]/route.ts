
import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";

type ProviderBuilder = (params: { id: string; s?: string; e?: string }) => string;

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(10, "10s"),
});

const providerUrlMap: Record<string, ProviderBuilder> = {
  vidsrc: ({ id, s, e }) => `https://vidsrc.to/embed/tv/${id}/${s}/${e}`,
  vidsrc_movie: ({ id }) => `https://vidsrc.to/embed/movie/${id}`,
  vidphantom: ({ id, s, e }) => `https://vidphantom.com/embed/tv/${id}/${s}/${e}`,
  vidphantom_movie: ({ id }) => `https://vidphantom.com/embed/movie/${id}`,
  '2embed': ({ id, s, e }) => `https://www.2embed.cc/embed_tv?id=${id}&s=${s}&e=${e}`,
  '2embed_movie': ({ id }) => `https://www.2embed.cc/embed/${id}`,
  nexstream: ({ id, s, e }) => `https://nexstream.site/embed/tv/${id}/${s}/${e}?signature=${process.env.NEXSTREAM_API_KEY}&ref=lumina`,
  nexstream_movie: ({ id }) => `https://nexstream.site/embed/movie/${id}?signature=${process.env.NEXSTREAM_API_KEY}&ref=lumina`,
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const ip = request.ip ?? "127.0.0.1";
  const { success } = await ratelimit.limit(`ratelimit_embed_${ip}`);

  if (!success) {
    return new NextResponse(JSON.stringify({ message: 'Too many requests' }), { status: 429, headers: { 'Content-Type': 'application/json' } });
  }

  const { searchParams } = new URL(request.url);
  const mediaType = searchParams.get('media_type');
  const provider = searchParams.get('provider');
  const season = searchParams.get('s') || '1';
  const episode = searchParams.get('e') || '1';
  const { id } = params;

  if (!id || !mediaType || !provider) {
    return new NextResponse('Missing required parameters: id, media_type, provider', { status: 400 });
  }
  
  if (provider === 'nexstream' && !process.env.NEXSTREAM_API_KEY) {
     console.error('FATAL: NEXSTREAM_API_KEY is not set in environment variables.');
     return new NextResponse('Internal Server Configuration Error', { status: 500 });
  }

  const providerKey = mediaType === 'movie' ? `${provider}_movie` : provider;
  const builder = providerUrlMap[providerKey];

  if (!builder) {
    return new NextResponse(`Invalid provider: ${provider}`, { status: 400 });
  }

  try {
    const embedUrl = builder({ id, s: season, e: episode });
    return NextResponse.redirect(embedUrl, { status: 307 });
  } catch (error) {
      console.error(`[EMBED_REDIRECT_ERROR] for provider ${provider}:`, error);
      const message = error instanceof Error ? error.message : "An unknown error occurred during URL construction.";
      return new NextResponse(JSON.stringify({ message: "Failed to construct embed URL.", error: message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
      });
  }
}
