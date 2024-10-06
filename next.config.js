const nextConfig = {
  experimental: {
    serverActions: true, // Enable server actions
    mdxRs: true, // Enable MDX remote support
    serverComponentsExternalPackages: ["mongoose"], // External packages for server components
  },
  images: {
    domains: ["example.com"], // Replace 'example.com' with your actual domain, e.g., 'myimagehost.com'
  },
};

export default nextConfig;
