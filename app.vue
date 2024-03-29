<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup>
import api from "~/axios";
import moment from 'moment'
import { indexStore } from "~/store";
import { userStore } from "~/store/user";
import { adminStore } from "~/store/admin";
import { storeToRefs } from "pinia";

let route = useRoute();
let { init_data } = storeToRefs(indexStore());
let { user_data, user_token } = storeToRefs(userStore());
let { admin_data, admin_token } = storeToRefs(adminStore());


if (route.name == "user" && !user_token.value) navigateTo("/");
if (route.name == "admin" && !admin_token.value) navigateTo("/");
init_data.value = reactive(await api.init_data());
if (!init_data.value) alert("数据获取异常！");

console.log('校队时间:'+moment().local('zh-cn').format('YYYY-MM-DD HH:mm:ss'));


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
    { name: "author", content: "yumao" }
  ],
});
</script>
