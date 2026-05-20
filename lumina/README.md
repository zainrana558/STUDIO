# Lumina - Cyberpunk Streaming Platform

A premium, high-fidelity streaming application powered by TMDB metadata, featuring glassmorphism design and neon color accents.

## Features

- **Glassmorphism Design**: Modern UI with frosted glass effects
- **Multi-Provider Failover**: VidSrc, NexStream, VidPhantom, 2Embed
- **TMDB Integration**: Live movie and TV show metadata
- **Responsive Player**: Custom video player with season/episode selection
- **Magnetic UI Elements**: Interactive cursor-tracking components
- **Cyberpunk Aesthetic**: Neon accents and dark cyberpunk theme

## Tech Stack

- **Next.js 14**: App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations
- **Lucide React**: Icon library

## Environment Variables

```bash
# Required
GEMINI_API_KEY=your_key_here
TMDB_API_KEY=your_key_here
APP_URL=your_deployment_url

# Supabase (Database)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# NexStream Video Provider
NEXSTREAM_API_KEY=
NEXT_PUBLIC_SITE_URL=

# Optional - Redis Rate Limiting
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
lumina/
├── nextjs_app_router/
│   ├── app/
│   │   ├── genre/[slug]/          # Genre pages with theme switching
│   │   └── [type]/[id]/           # Media detail pages
│   ├── components/
│   │   ├── VideoEmbedPlayer.tsx   # Multi-provider video player
│   │   ├── Navbar.tsx              # Fixed navigation with effects
│   │   └── ShareButton.tsx         # Social sharing
│   └── types/                      # TypeScript definitions
├── metadata.json                   # Project metadata
├── .env.example                    # Environment template
└── README.md                       # This file
```

## Component Details

### VideoEmbedPlayer
- Supports movies and TV shows
- Multiple embed providers with automatic failover
- Season/Episode selection for TV content
- Volume control with localStorage persistence
- Fullscreen support

### Navbar
- Fixed top navigation
- Custom magnetic cursor effect
- Genre navigation links
- Search functionality
- Social sharing button

### Media Details Page
- Server-side TMDB data fetching
- Fallback cinematic details
- Cast information
- Genre display
- Rating and duration

## License

MIT
