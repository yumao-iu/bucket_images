<template>
  <div id="UserMoney">
    <div>
      <img src="/images/pai.jpg" >
      <i>🚧 等待施工中 🚧</i>
    </div>
  </div>
</template>


<script setup>
import { indexStore } from "~/store";
import { userStore } from "~/store/user";
import { storeToRefs } from "pinia";
import qrcode from "qrcode";
import api from "~/axios";
import user_api from "~/axios/user";
import lodash from "lodash";
let { user_data, user_token } = storeToRefs(userStore());
let { update_user } = userStore();
let { throttle } = lodash;
</script>





<style lang="less">
#UserMoney {
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
  >div{
    img{
      width: 110px;
      margin-bottom: 20px;
    }
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>