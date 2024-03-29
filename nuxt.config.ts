
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: false,
  },
  modules: ['nuxt-swiper','@pinia/nuxt','@pinia-plugin-persistedstate/nuxt'],
  // vue:{
  //   __VUE_PROD_DEVTOOLS__
  // }
  // nitro:{
  //   prerender:{
  //     ignore:['/images']
  //   }
  // }
})