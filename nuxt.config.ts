// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  css: ["@/assets/input.css", "@/assets/output.css"],
  modules: ["@nuxtjs/tailwindcss"],
})

