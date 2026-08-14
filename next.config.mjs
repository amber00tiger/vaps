const isGithubPages = process.env.NEXT_PUBLIC_SITE_BASE_PATH === "/vaps";

/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: isGithubPages ? "/vaps" : undefined,
  basePath: isGithubPages ? "/vaps" : undefined,
  images: {
    unoptimized: true,
  },
  output: isGithubPages ? "export" : undefined,
  trailingSlash: isGithubPages,
};

export default nextConfig;
