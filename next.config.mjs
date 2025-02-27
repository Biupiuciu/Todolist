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
// const nextConfig = {
//   webpack: (config) => {
//     config.module.rules.push({
//       test: /\.m?js/,
//       resolve: {
//         fullySpecified: false, // Prevents Webpack from interpreting modules as ESM
//       },
//     });
//     return config;
//   },
// };
  export default nextConfig;