/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    webpack(config) {
      
      config.resolve.fallback = {
        fs: false,
        module: false,
      };
      return config;
    },
  };
  
  export default nextConfig;