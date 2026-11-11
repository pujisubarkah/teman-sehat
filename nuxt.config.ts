// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  vite: {
    optimizeDeps: {
      include: ['@vueuse/core', 'chart.js', 'vue-chartjs', 'lucide-vue-next']
    }
  },
  app: {
    head: {
      title: 'TemanSehat — Kenali Tubuhmu, Pahami Kebiasaanmu, Nikmati Sehatmu',
      meta: [
        { name: 'description', content: 'TemanSehat: Buku saku digital pantau Tensi Darah, Gula Darah, Kolesterol & Asam Urat dengan panduan kebiasaan kecil harian.' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover' },
        { name: 'theme-color', content: '#0284c7' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'apple-mobile-web-app-title', content: 'TemanSehat' }
      ],
      link: [
        { rel: 'manifest', href: '/manifest.webmanifest' },
        { rel: 'icon', type: 'image/svg+xml', href: '/icon.svg' },
        { rel: 'apple-touch-icon', href: '/icon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap' }
      ]
    }
  }
})
