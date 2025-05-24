import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";
import { VitePWA } from 'vite-plugin-pwa'

// Only use lovable-tagger in development, and only if available.
// This avoids ESM/CJS issues and keeps prod builds clean and cheap.
async function getDevPlugins(mode) {
  const plugins = [react()];
  if (mode === 'development') {
    try {
      const { componentTagger } = await import('lovable-tagger');
      plugins.push(componentTagger());
    } catch (e) {
      console.warn('lovable-tagger not found or failed to load:', e);
    }
  }
  plugins.push(VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
    manifest: {
      name: 'CityPulse',
      short_name: 'CityPulse',
      description: 'Your Local Business Discovery Platform',
      theme_color: '#ffffff',
      icons: [
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    }
  }));
  return plugins.filter(Boolean);
}

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: await getDevPlugins(mode),
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext'
    },
    include: [
      '@clerk/clerk-react',
      '@stripe/stripe-js',
      '@supabase/supabase-js'
    ]
  },
  build: {
    target: 'esnext',
    // rollupOptions: {
    //   external: [
    //     '@clerk/clerk-react',
    //     '@stripe/stripe-js',
    //     '@supabase/supabase-js'
    //   ]
    // }
  }
}));
