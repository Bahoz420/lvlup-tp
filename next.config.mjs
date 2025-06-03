/** @type {import('next').NextConfig} */
const nextConfig = {
eslint: {
ignoreDuringBuilds: true,
},
typescript: {
ignoreBuildErrors: true,
},
images: {
// unoptimized: false, // Or remove this line entirely to enable optimization
// If you have specific domains for images, configure them here:
// remotePatterns: [
//   {
//     protocol: 'https',
//     hostname: 'example.com',
//     port: '',
//     pathname: '/images/**',
//   },
// ],
},
// experimental: { // Remove this entire experimental block
//   optimizeCss: true, 
// },
};

export default nextConfig;
