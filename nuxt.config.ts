// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: "2025-05-15",
  devtools: { enabled: false },
  css: ["@/assets/css/main.css", "primeicons/primeicons.css"],
});
