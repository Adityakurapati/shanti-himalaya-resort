/** @type {import('next').NextConfig} */
const nextConfig={
        reactStrictMode: true,
        images: {
                domains: [ "localhost", "example.com" ], // add your actual domains here
        },
        experimental: {
                typedRoutes: true,
        },
};

export default nextConfig;
