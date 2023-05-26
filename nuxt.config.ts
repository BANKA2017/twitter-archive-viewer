// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  devServer: {
    host: '0.0.0.0',
    port: 3003
  },
  runtimeConfig: {
    public: {
      //NUXT_GA_ID: process.env.NUXT_GA_ID,
    }
  },
  modules: [
    'nuxt-lodash',
    '@vueuse/nuxt',
    '@nuxtjs/tailwindcss',
    [
      '@pinia/nuxt',
      {
        autoImports: [
          // automatically imports `defineStore`
          'defineStore', // import { defineStore } from 'pinia'
        ],
      },
    ],
  ],
  imports: {
    dirs: ['./stores']
  },
  experimental: {
    payloadExtraction: false
  },
})
