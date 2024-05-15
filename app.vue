<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup>
import api from "~/axios";
import { indexStore } from "~/store";
import { userStore } from "~/store/user";
import { businessStore } from "~/store/business";
import { adminStore } from "~/store/admin";
import { storeToRefs } from "pinia";

let route = useRoute();
let router = useRouter();
let { init_data } = storeToRefs(indexStore());
let { user_token } = storeToRefs(userStore());
let { token_business } = storeToRefs(businessStore());
let { admin_token } = storeToRefs(adminStore());

if (route.name == "user" && !user_token.value) navigateTo("/");
if (route.name == "admin" && !admin_token.value) navigateTo("/");
if (route.name == "business" && !token_business.value) navigateTo("/");
init_data.value = ref(await api.init_data());

// let c = config()
// console.log(c.domain);

onMounted(() => {
  if (window.screen.width < 600)
    router.push({
      path: "/error",
      query: { message: "屏幕太小，请使用电脑访问😋" },
    });
});
useHead({
  title: "广西科技大学智慧食堂信息管理系统",
  link: [
    {
      rel: "stylesheet",
      href: "/css/public.css",
    },
    {
      rel: "stylesheet",
      href: "/css/iconfont.css",
    },
  ],
  meta: [
    { name: "description", content: "广西科技大学智慧食堂信息管理系统描述" },
    { name: "keyword", content: "广西科技大学,智慧食堂信息,管理系统," },
    { name: "author", content: "yumao" },
  ],
});
</script>
