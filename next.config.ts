import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Security Headers
    async headers() {
        return [
            {
                source: "/api/:path*",
                headers: [
                    // CORS
                    {
                        key: "Access-Control-Allow-Origin",
                        value: process.env.ALLOWED_ORIGIN || "*",
                    },
                    {
                        key: "Access-Control-Allow-Methods",
                        value: "GET, POST, PUT, DELETE, OPTIONS",
                    },
                    {
                        key: "Access-Control-Allow-Headers",
                        value: "Content-Type, Authorization",
                    },
                    // Security
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff",
                    },
                    {
                        key: "X-Frame-Options",
                        value: "DENY",
                    },
                    {
                        key: "X-XSS-Protection",
                        value: "1; mode=block",
                    },
                    {
                        key: "Referrer-Policy",
                        value: "strict-origin-when-cross-origin",
                    },
                ],
            },
            {
                source: "/:path*",
                headers: [
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff",
                    },
                    {
                        key: "X-Frame-Options",
                        value: "DENY",
                    },
                ],
            },
        ];
    },

    // Image Optimization
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "localhost" },
            { protocol: "https", hostname: "*.supabase.co" },
            { protocol: "https", hostname: "picsum.photos" },
        ],
        formats: ["image/webp", "image/avif"],
    },

    // Experimental Features
    experimental: {
        optimizePackageImports: ["lucide-react", "recharts"],
    },

    // Compiler Options
    compiler: {
        removeConsole: process.env.NODE_ENV === "production",
    },

    // TypeScript
    typescript: {
        ignoreBuildErrors: false,
    },
};

export default nextConfig;
