<template>
  <div>{{$route.query.message}}</div>
</template>

<script setup>
useHead({
  link: [
    {
      rel: "stylesheet",
      href: "/css/public.css",
    },
  ],
});
</script>