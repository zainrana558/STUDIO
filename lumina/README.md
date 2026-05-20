# Lumina - Cyberpunk Streaming Platform

A premium, high-fidelity streaming application powered by TMDB metadata, featuring a glassmorphism design and a modern, secure Next.js architecture.

## Features

- **Hardened Security**: Strict Content Security Policy (CSP), HTTP security headers, and a secure server-side API proxy.
- **Glassmorphism Design**: Modern UI with frosted glass effects and responsive layouts.
- **Multi-Provider Failover**: Resilient video player supporting VidSrc, NexStream, VidPhantom, and 2Embed with automatic timeout handling.
- **Live TMDB Integration**: Server-side fetching of movie and TV show metadata for optimal performance and SEO.
- **Secure Auth Ready**: Built-in, secure, server-side Supabase client for easy integration of user authentication.
- **Cyberpunk Aesthetic**: Neon accents and a dark, immersive theme.

## Tech Stack

- **Next.js 14**: App Router, Middleware, Server Components
- **TypeScript**: Strict type-safe development
- **Tailwind CSS**: Utility-first styling and responsive design
- **Supabase**: Authentication and database (integration-ready)
- **Framer Motion**: Smooth animations
- **Lucide React**: Icon library

## Getting Started

1.  **Clone the repository.**

2.  **Set up Environment Variables:**
    Create a new file named `.env.local` inside the `nextjs_app_router` directory. Copy the contents of `.env.example` into it and fill in the required values.

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

This is the content for your `.env.local` file. It is critical for the application's functionality.

```bash
# --- CORE APPLICATION ---
# Your secret key for the The Movie Database (TMDB) API.
# Required for fetching all movie/TV show data.
TMDB_API_KEY=your_key_here

# The public, canonical URL of your deployed application.
# Required for metadata, social sharing, and SEO.
# Example: https://lumina.yourdomain.com
NEXT_PUBLIC_APP_URL=http://localhost:3000

# --- AUTHENTICATION & DATABASE (Supabase) ---
# The public URL for your Supabase project.
# Found in your Supabase project's API settings.
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url

# The public "anon" key for your Supabase project.
# Found in your Supabase project's API settings.
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# The "service_role" key for server-side admin tasks.
# Keep this secret and only use it in secure server environments.
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# --- STREAMING PROVIDERS ---
# The API key/signature for the NexStream video provider.
# Optional, but required if you want the NexStream provider to work.
NEXSTREAM_API_KEY=your_nexstream_api_key

# --- OPTIONAL ---
# Secret key for an external AI service (e.g., Google Gemini).
# Not used by the core application, but reserved for potential extensions.
GEMINI_API_KEY=your_gemini_key_here

# Credentials for Upstash Redis, if you plan to implement rate limiting.
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

## Security Hardening

This application has been hardened with the following security measures:

-   **HTTP Security Headers**: `middleware.ts` implements a strict Content Security Policy (CSP), `X-Content-Type-Options`, `Strict-Transport-Security`, `X-Frame-Options`, and `Referrer-Policy` on all incoming requests.
-   **Nonce-Based CSP**: Mitigates XSS attacks by ensuring only server-authorized scripts are executed.
-   **API Key Protection**: All sensitive API keys (TMDB, NexStream) are used exclusively on the server side, preventing exposure to the client browser.
-   **Secure Iframe Sandboxing**: The `VideoEmbedPlayer` uses a `sandbox` attribute to restrict the permissions of embedded third-party content, preventing malicious actions.

This comprehensive refactoring and hardening process is now complete. The Lumina application is secure, stable, and well-documented, adhering to modern best practices for web application development.
