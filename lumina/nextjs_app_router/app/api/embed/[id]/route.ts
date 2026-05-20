import { NextRequest, NextResponse } from 'next/server';

type ProviderBuilder = (params: { id: string; s?: string; e?: string }) => string;

const providerUrlMap: Record<string, ProviderBuilder> = {
  vidsrc: ({ id, s, e }) => `https://vidsrc.to/embed/tv/${id}/${s}/${e}`,
  vidsrc_movie: ({ id }) => `https://vidsrc.to/embed/movie/${id}`,
  vidphantom: ({ id, s, e }) => `https://vidphantom.com/embed/tv/${id}/${s}/${e}`,
  vidphantom_movie: ({ id }) => `https://vidphantom.com/embed/movie/${id}`,
  '2embed': ({ id, s, e }) => `https://www.2embed.cc/embed_tv?id=${id}&s=${s}&e=${e}`,
  '2embed_movie': ({ id }) => `https://www.2embed.cc/embed/${id}`,
  // CORRECTED: Using NEXSTREAM_API_KEY to match documentation
  nexstream: ({ id, s, e }) => `https://nexstream.site/embed/tv/${id}/${s}/${e}?signature=${process.env.NEXSTREAM_API_KEY}&ref=lumina`,
  nexstream_movie: ({ id }) => `https://nexstream.site/embed/movie/${id}?signature=${process.env.NEXSTREAM_API_KEY}&ref=lumina`,
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(request.url);
  const mediaType = searchParams.get('media_type');
  const provider = searchParams.get('provider');
  const season = searchParams.get('s') || '1';
  const episode = searchParams.get('e') || '1';
  const { id } = params;

  if (!id || !mediaType || !provider) {
    return new NextResponse('Missing required parameters: id, media_type, provider', { status: 400 });
  }
  
  // Key for NexStream validation, aligns with corrected environment variable
  if (provider === 'nexstream' && !process.env.NEXSTREAM_API_KEY) {
     console.error('FATAL: NEXSTREAM_API_KEY is not set in environment variables.');
     // Return a generic error to the client to avoid leaking configuration details
     return new NextResponse('Internal Server Configuration Error', { status: 500 });
  }

  const providerKey = mediaType === 'movie' ? `${provider}_movie` : provider;
  const builder = providerUrlMap[providerKey];

  if (!builder) {
    return new NextResponse(`Invalid provider: ${provider}`, { status: 400 });
  }

  const embedUrl = builder({ id, s: season, e: episode });

  // Redirect to the final embed URL
  return NextResponse.redirect(embedUrl);
}
