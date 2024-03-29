<template>
  <div></div>
</template>
<script setup>
import api from "~/axios";
let route = useRoute();

onMounted(async () => {
  let { code } = await api.check_find(route.query.token);
  if (code) {
    alert("修改成功！");
    location.href = "/";
  } else alert("链接不存在或者已过期");
});
</script>