const path = require('path')

module.exports = {
  // Set the output directory to the Spring Boot static folder
  distDir: './build',
  
  // Ensure Next.js generates static HTML files
  output: 'export',
  
  // Optional: Configure asset prefix if needed
  assetPrefix: '/static/',

  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
}
