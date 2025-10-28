/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        hostname: "cdn.prod.website-files.com",
        protocol: "https",
      },
      {
        hostname: "picsum.photos",
        protocol: "https",
      },
    ],
  },
  allowedDevOrigins: ["https://bef8c4891487.ngrok-free.app"],
};

export default nextConfig;
