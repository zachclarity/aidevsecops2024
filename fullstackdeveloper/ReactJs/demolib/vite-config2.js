// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs-extra';

// Copy function to run after build
const copyToSpringBoot = () => {
  return {
    name: 'copy-to-spring-boot',
    closeBundle: async () => {
      const sourcePath = resolve(__dirname, 'build');
      const targetPath = resolve(__dirname, '../src/main/resources/static');
      
      try {
        // Ensure target directory exists
        await fs.ensureDir(targetPath);
        // Clean existing files
        await fs.emptyDir(targetPath);
        // Copy build files
        await fs.copy(sourcePath, targetPath);
        console.log('Successfully copied build files to Spring Boot static resources');
      } catch (err) {
        console.error('Error copying build files:', err);
      }
    }
  };
};

export default defineConfig({
  plugins: [
    react(),
    copyToSpringBoot()
  ],
  
  build: {
    outDir: 'build',
    sourcemap: true,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
        assetFileNames: 'static/[ext]/[name]-[hash][extname]',
        chunkFileNames: 'static/js/[name]-[hash].js',
        entryFileNames: 'static/js/[name]-[hash].js',
      },
    },
    assetsDir: 'static',
  },

  server: {
    port: 3000,
    open: true,
  },

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },

  envPrefix: 'VITE_',
})
