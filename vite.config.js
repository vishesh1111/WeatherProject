import { defineConfig } from 'vite';

export default defineConfig({
  root: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html',
        search: './search.html',
        world: './world.html'
      }
    }
  },
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.VITE_API_KEY)
  }
});
