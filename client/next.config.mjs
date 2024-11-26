import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Enable React strict mode for improved error handling
  swcMinify: true, // Enable SWC minification for improved performance
  compiler: {
    removeConsole: process.env.NODE_ENV !== "development", // Remove console.log in production
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "caligo.site",
        pathname: "**", // Match all routes
      },
      {
        protocol: "http",
        hostname: "caligo.site",
        pathname: "**", // Match all routes
      },
      {
        protocol: "https",
        hostname: "mtek3d.com",
        pathname: "/**",
      },
    ],
  },
};

export default withPWA({
  dest: "public", // Destination directory for the PWA files
  disable: process.env.NODE_ENV === "development", // Disable PWA in the development environment
  register: true, // Register the PWA service worker
  skipWaiting: true, // Skip waiting for service worker activation
})(nextConfig);
