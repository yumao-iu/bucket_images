<template>
  <div id="WebSet">
    <div class="admin_set">
      <div class="new_user">
        <p class="title">新账号</p>
        <p class="inp">
          <em></em
          ><input type="text" maxlength="15" v-model="admin_data.user" />
        </p>
      </div>
      <div class="new_mail">
        <p class="title">新邮箱</p>
        <p class="inp">
          <em></em
          ><input type="text" maxlength="25" v-model="admin_data.mail" />
        </p>
      </div>
      <div class="new_pass">
        <p class="title">新密码</p>
        <p class="inp">
          <em></em
          ><input
            type="password"
            maxlength="15"
            v-model="admin_data.new_pass"
          />
        </p>
      </div>
      <div class="old_pass">
        <p class="title">旧密码</p>
        <p class="inp">
          <em></em
          ><input
            type="password"
            maxlength="15"
            v-model="admin_data.old_pass"
          />
        </p>
      </div>
      <div class="set_btn" @click="set_account">确定修改</div>
    </div>
    <div class="log_set">
      <p class="log_title">
        <em>系统日志</em
        ><em
          ><input
            type="text"
            placeholder="搜索点搜索吧😥"
            v-model="search_text"
            @keydown.enter="search_log"
          /><i @click="search_log">确定</i
          ><i @click="search_cancel">取消</i></em
        >
      </p>
      <p class="log_header">
        <em class="tag_01">编号</em><em class="tag_02">日志</em
        ><em class="tag_03">时间</em><em class="tag_04"> 地点</em
        ><em class="tag_05">设备</em>
      </p>
      <div class="log_main">
        <p v-for="(v, i) in data_log" :key="i">
          <em class="tag_01">{{ v.id }}</em
          ><em class="tag_02">{{ v.content }}</em
          ><em class="tag_03">{{ v.time }}</em
          ><em :title="v.ip" class="tag_04">{{ v.ip }}</em
          ><em :title="v.device" class="tag_05">{{ v.device }}</em>
        </p>
      </div>
    </div>
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

let data_log = ref(await api.get_log());
let search_text = ref("");
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
  if (
    !/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,6})$/.test(
      admin_data.value.mail
    )
  ) {
    alert("邮箱格式好像不对 🤡");
    return 0;
  }
  let { data } = await api.set_account(admin_data.value);
  let { state } = data;
  if (state == 200)
    alert("修改成功！"),
      (admin_data.value.old_pass = ""),
      (admin_data.value.new_pass = "");
  else alert("旧密码错误！");
};
let search_log = async () => {
  if ((await api.search_log(search_text.value)).length)
    data_log.value = await api.search_log(search_text.value);
  else alert("无数据🤯");
};
let search_cancel = async () => {
  data_log.value = await api.get_log();
  search_text.value = "";
};
</script>
<style lang="less">
#WebSet {
  .admin_set {
    width: 90%;
    margin-top: 50px;
    margin-left: 50px;
    margin-bottom: 60px;
    display: flex;
    align-items: center;

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
      width: 200px;
      margin-right: 30px;
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
  .log_set {
    width: 90%;
    margin: 0 auto;
    .log_title {
      display: flex;
      em {
        margin-bottom: 40px;
        margin-right: 30px;
        border-bottom: 1px solid rgb(221, 216, 216);
        i {
          cursor: pointer;
          margin-right: 20px;
        }
        input {
          font-size: 18px;
        }
      }
    }
    .log_header {
      display: flex;
      flex-grow: 1;
      margin-bottom: 20px;
      em {
        margin-right: 20px;
      }
    }
    .log_main {
      height: 300px;
      overflow: auto;
      p {
        display: flex;
        margin-bottom: 20px;
        border-bottom: 1px solid rgb(242, 240, 240);
        height: 22px;
        transition: all 0.5s;
        em {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-right: 20px;
        }
        &:hover {
          border-bottom: 1px solid rgb(238, 235, 235);
        }
      }
    }
    .tag_01 {
      width: 8%;
    }
    .tag_02 {
      width: 10%;
    }
    .tag_03 {
      width: 15%;
    }
    .tag_04 {
      width: 23%;
    }
    .tag_05 {
      width: 30%;
    }
  }
}
</style>