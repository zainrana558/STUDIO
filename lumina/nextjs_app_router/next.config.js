/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['image.tmdb.org'],
    },
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    // The headers are now primarily handled by middleware.ts
                    // This section can be kept for fallback or specific path overrides if needed.
                    // For this audit, we centralize control in middleware.
                ],
            },
        ];
    },
};

module.exports = nextConfig;
