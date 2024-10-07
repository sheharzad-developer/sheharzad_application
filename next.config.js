const nextConfig = {
  experimental: {
    mdxRs: true, // Enable MDX remote support
    serverComponentsExternalPackages: ["mongoose"], // External packages for server components
  },
  images: {
    domains: ["example.com"], // Replace 'example.com' with your actual domain
  },
};

export default nextConfig;
