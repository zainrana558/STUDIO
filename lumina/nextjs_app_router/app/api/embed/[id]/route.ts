
import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { getProviderUrl } from '@/lib/providers';

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(10, "10s"),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const ip = request.ip ?? "127.0.0.1";

  try {
    const { success } = await ratelimit.limit(`ratelimit_embed_${ip}`);
    if (!success) {
      return new NextResponse(JSON.stringify({ message: 'Too many requests' }), { status: 429, headers: { 'Content-Type': 'application/json' } });
    }
  } catch {
    console.warn("[EMBED] Rate limit check failed, allowing request.");
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

  if (!/^\d+$/.test(season) || !/^\d+$/.test(episode)) {
    return new NextResponse('Invalid season or episode number', { status: 400 });
  }

  try {
    const embedUrl = getProviderUrl(provider, mediaType as 'movie' | 'tv', { id, s: season, e: episode });
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
