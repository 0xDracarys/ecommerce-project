/** @type {import('next').NextConfig} */
const nextConfig = {
  // typescript: {
  //   ignoreBuildErrors: true, // Removed as per plan
  // },
  images: {
    domains: ["res.cloudinary.com", "via.placeholder.com"],
  },
};

module.exports = nextConfig;
