<template>
  <div id="WebSet">
    <div class="admin_set">
      <p class="title">新账号</p>
      <p class="inp">
        <em></em><input type="text" maxlength="15" v-model="admin_data.user" />
      </p>
      <p class="title">新邮箱</p>
      <p class="inp">
        <em></em><input type="text" maxlength="25" v-model="admin_data.mail" />
      </p>
      <p class="title">新密码</p>
      <p class="inp">
        <em></em
        ><input type="password" maxlength="15" v-model="admin_data.new_pass" />
      </p>
      <p class="title">旧密码</p>
      <p class="inp">
        <em></em
        ><input type="password" maxlength="15" v-model="admin_data.old_pass" />
      </p>
      <p class="set_btn" @click="set_account">确定修改</p>
    </div>
    <!-- <div></div> -->
  </div>
</template>

<script setup>
import { adminStore } from "~/store/admin";
import { storeToRefs } from "pinia";
import _ from "lodash";
import api from "~/axios/admin";

let { admin_data } = storeToRefs(adminStore());
admin_data.value.old_pass = "";
admin_data.value.new_pass = "";

let set_account = async () => {
  if (
    admin_data.value.user.length < 6 ||
    admin_data.value.old_pass.length < 6 ||
    admin_data.value.new_pass.length < 6 ||
    admin_data.value.mail.length < 6
    ) {
      alert("至少六位数 🤡");
      return 0;
    }
  if(!/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,6})$/.test(admin_data.value.mail)){
      alert("邮箱格式好像不对 🤡");
      return 0;
    }
  // if (admin_data.value.new.length < 6) return;
  let { data } = await api.set_account(admin_data.value);
  let { state } = data;
  if (state == 200) alert("修改成功！");
  else alert("旧密码错误！");
};
</script>
<style lang="less">
#WebSet {
  .admin_set {
    width: 25%;
    margin-top: 50px;
    margin-left: 50px;
    p {
      width: 100%;
    }
    .title {
      font-size: 12px;
      margin-bottom: 5px;
    }
    .inp {
      border-radius: 3px;
      border: 1px solid rgb(220, 216, 216);
      margin-bottom: 20px;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;

      input {
        width: 90%;
        font-size: 18px;
        color: rgb(53, 52, 52);
      }
    }
    .set_btn {
      width: 80px;
      height: 30px;
      line-height: 32px;
      text-align: center;
      border-radius: 2px;
      color: white;
      padding: 1px 3px;
      cursor: pointer;
      font-size: 14px;
      background: linear-gradient(
        90deg,
        rgb(115, 199, 207),
        rgb(128, 208, 215)
      );
      transition: all 0.5s;
      opacity: 0.9;
      &:hover {
        opacity: 1;
      }
    }
  }
}
</style>