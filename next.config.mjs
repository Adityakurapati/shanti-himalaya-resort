const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
        pathname: "/gh/**",
      },
    ],
  },

  experimental: {
    typedRoutes: false,
  },
};

export default nextConfig;
