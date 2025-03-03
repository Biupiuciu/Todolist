/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      module: false,
    };
    config.externals = config.externals || {};
    config.externals['@ant-design/icons'] = 'commonjs @ant-design/icons';
    return config;
  },
   
  };

  export default nextConfig;