
<template>
  <div>
    <img :src="src" />
  </div>
</template>

<script setup>
import qrcode from "qrcode";
import api from "~/axios";
let src = ref(null);
let {data} = await api.pay('query',{trade:'yumao_869'});
let {code,msg} = data
console.log(code);
// if (data.code == "10000") src.value = await qrcode.toDataURL(data.qrCode);
// else alert("二维码生成失败", data.code);
//4316
</script>