
<template>
  <div id="UserSet">
    <div class="title">
      <div class="left">
        <p>
          <input
            type="text"
            placeholder="搜点什么吧😋"
            v-model="search_text"
            maxlength="19"
            @keydown.enter="search_user"
            @input="filter_s"
          />
          <i class="yumao icon-sousuo" @click="search_user"></i>
          <i class="yumao icon-dacha" @click="search_cancel"></i>
        </p>
      </div>
      <div class="right">
        <p class="add_user" @click="add_user">添加</p>
      </div>
    </div>
    <div class="content">
      <div class="header">
        <p><em></em><em>编号</em></p>
        <p><em></em><em>账号</em></p>
        <p><em></em><em>昵称</em></p>
        <p><em></em><em>余额</em></p>
        <p><em></em><em>操作</em></p>
      </div>
      <div class="main">
        <div id="food_1" v-for="v in data" :key="v">
          <p>
            <em></em><em>{{ v.id }}</em>
          </p>
          <p>
            <em></em><em>{{ v.user }}</em>
          </p>
          <p>
            <em></em><em>{{ v.name }}</em>
          </p>
          <p>
            <em></em><em>{{ v.price }}</em>
          </p>
          <p>
            <em class="other_btn" @click="more_user(v)"><i></i><i>编辑</i></em>
          </p>
        </div>
      </div>
    </div>
    <Transition name="show_mask" mode="out-in">
      <div id="show_mask" v-show="show_mask">
        <div class="back" @click="show_mask = 0"></div>
        <div class="content">
          <div class="item" style="margin-top: 35px">
            <p>编号</p>
            <p>
              <input
                type="text"
                v-model="show_more.id"
                disabled
                style="cursor: not-allowed"
              />
            </p>
          </div>
          <div class="item">
            <p>昵称</p>
            <p>
              <input type="text" v-model="show_more.name" />
            </p>
          </div>
          <div class="item">
            <p>账号</p>
            <p>
              <input type="text" v-model="show_more.user" />
            </p>
          </div>
          <div class="item">
            <p>邮箱</p>
            <p>
              <input type="text" v-model="show_more.mail" />
            </p>
          </div>
          <div class="item">
            <p>余额</p>
            <p>
              <input type="text" v-model="show_more.price" />
            </p>
          </div>
          <div class="item">
            <p>密码</p>
            <p>
              <input type="text" v-model="show_more.pass" />
            </p>
          </div>
          <div>
            <p class="ban_btn" @click="ban_user">封禁</p>
            <p class="delete_btn" @click="delete_user">删除</p>
            <p class="save_btn" @click="save_user">保存</p>
          </div>
        </div>
      </div>
    </Transition>
    <Transition name="add_mask" mode="out-in">
      <div id="add_mask" v-show="add_mask">
        <div class="back" @click="add_mask = 0"></div>
        <div class="content">
          <div class="item" style="margin-top: 35px">
            <p>账号</p>
            <p>
              <input type="text" v-model="add_user_data.user" />
            </p>
          </div>
          <div class="item">
            <p>邮箱</p>
            <p>
              <input type="text" v-model="add_user_data.mail" />
            </p>
          </div>
          <div class="item">
            <p>密码</p>
            <p>
              <input type="text" v-model="add_user_data.pass" />
            </p>
          </div>

          <div>
            <p class="add_btn" @click="sure_add_user">添加</p>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
<script setup>
import { indexStore } from "~/store";
import { adminStore } from "~/store/admin";
import { storeToRefs } from "pinia";
import api from "~/axios/admin";

let { init_data } = storeToRefs(indexStore());
let { admin_token } = storeToRefs(adminStore());
let data = ref(await api.get_user());
let show_mask = ref(0);
let add_mask = ref(0);
let search_text = ref("");
let search_data = reactive([]);
let show_more = reactive({});
let add_user_data = ref({ user: "", pass: "", mail: "" });

let search_user = async () => {
  search_data = await api.search_user(search_text.value);
  if (search_data.length) data.value = search_data;
  else alert("搜索无结果 🤡");
};
let search_cancel = async () => {
  search_data = await api.search_user('');
  data.value = search_data;
  search_text.value = "";
};
let filter_s = async () => {
  search_text.value = search_text.value.replace(/\s+/g, "");
};
let more_user = async (v) => {
  show_mask.value = 1;
  show_more = v;
};
let ban_user = async () => {
  alert("该功能来不及做了 🤡");
};
let save_user = async () => {
  let data = await api.save_user(show_more);
  let { code } = data;
  if (code == 1) alert("修改成功！");
  else if (code == -1) alert("用户名已经存在");
  else if (code == -2) alert("邮箱已经存在");
};
let delete_user = async () => {
  if (confirm("确定删除?")) {
    await api.delete_user(show_more);
    alert("删除成功！");
    data.value = data.value.filter((v) => v.id != show_more.id);
    show_mask.value = 0;
  }
};
let add_user = async () => {
  add_mask.value = 1;
};
let sure_add_user = async () => {
  let data = await api.add_user(add_user_data.value);
  let { code } = data;
  if (code == -1) alert("用户已经存在！🤡");
  else if (code == -2) alert("邮箱已经存在！🤡");
  else {
    alert("添加成功！");
    add_mask.value = 0;
    add_user_data.value.id = 1;
    data.value.unshift(add_user_data.value);
  }
};
</script>

  <style lang="less">
#UserSet {
  > .title {
    width: 95%;
    height: 60px;
    border-bottom: 1px solid rgba(210, 199, 199, 0.4);
    margin: 10px auto 10px auto;
    margin-bottom: 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    > div {
      width: 48%;
      height: 80%;
    }
    .left {
      p {
        display: flex;
        align-items: center;
        height: 35px;
        width: 260px;
        border: 1px solid rgba(224, 213, 213, 0.4);
        border-radius: 2px;
        transition: all 0.5s;
        &:hover {
          border: 1px solid rgba(178, 170, 170, 0.4);
        }
        input {
          width: 73%;
          font-size: 17px;
          margin-left: 14px;
          color: rgb(71, 69, 69);
        }
        i {
          color: rgb(112, 110, 110);
          margin-left: 7px;
          cursor: pointer;
        }
        input::-webkit-input-placeholder {
          font-size: 15px;
        }
      }
    }
    .right {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .add_user {
        margin-right: 45px;
        font-size: 15px;
        border-radius: 1px;
        cursor: pointer;
        transition: all 0.5s;
        &:hover {
          color: rgb(108, 165, 187);
        }
      }
    }
  }
  .content {
    width: 95%;
    margin: 0 auto;
    .header {
      display: flex;
      width: 100%;
      border-bottom: 1px solid rgb(233, 229, 229);
      border-radius: 1.5px;
      margin-bottom: 10px;
      p {
        height: 35px;
        line-height: 35px;
        padding: 0 10px;
        width: 20%;
        background: rgb(250, 250, 250);
      }
      p:first-child {
        width: 10%;
      }
    }
    .main {
      width: 100%;
      height: 60vh;
      overflow: auto;
      > div[id^="food_"] {
        display: flex;
        width: 100%;
        border-bottom: 1px solid rgb(245, 240, 255);
        height: 45px;
        display: flex;
        align-items: center;
        transition: all 0.5s;
        background: white;
        &:hover {
          border-bottom: 1px solid rgb(230, 230, 230);
          background: rgb(248, 248, 248);
        }
        > p {
          display: flex;
          padding: 0 10px;
          width: 20%;
          height: 35px;
          line-height: 35px;
          em {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        > p:first-child {
          width: 10%;
        }
        > p:last-child {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          em {
            margin-right: 18px;
            cursor: pointer;
            height: 25px;
            line-height: 27px;
            font-size: 15px;
            border-radius: 2px;
            transition: all 0.5s;
            opacity: 0.9;
            &:hover {
              opacity: 1;
              color: rgb(38, 169, 220);
            }
          }
        }
      }
    }
  }
  #show_mask {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 2;
    width: 100vw;
    height: 100vh;
    .back {
      width: 100%;
      height: 100%;
      background: rgba(181, 174, 174, 0.94);
    }
    .content {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 420px;
      background: white;
      border-radius: 1px;

      .double_item {
        display: flex;
        width: 80%;
        justify-content: space-between;
        margin-bottom: 18px;
        > div {
          width: 48%;
          > p:first-child {
            font-size: 14px;
            margin-bottom: 6px;
          }
          > p:last-child {
            display: flex;
            align-items: center;
            height: 25px;
            border: 1px solid rgb(222, 221, 221);
          }
          input {
            width: 80%;
            font-size: 20px;
            border-radius: 1px;
            margin-left: 5px;
            font-size: 16px;
          }
        }
      }
      .item {
        width: 80%;
        margin-bottom: 20px;
        > p:first-child {
          margin-bottom: 6px;
          font-size: 14px;
        }
        > p:last-child {
          display: flex;
          align-items: center;
          height: 30px;
          border: 1px solid rgb(222, 221, 221);
          border-radius: 1px;
          input {
            margin-left: 10px;
            width: 80%;
            font-size: 18px;
          }
        }
      }
      > div:nth-last-of-type(1) {
        margin-top: 15px;
        margin-bottom: 25px;
        width: 80%;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        p {
          padding: 2px 10px;
          font-size: 15px;
          margin-left: 20px;
          border-radius: 1px;
          cursor: pointer;
          transition: all 0.5s;
        }
        .ban_btn {
          color: red;
        }
        .delete_btn {
          background: rgb(39, 38, 38);
          border: 1px solid rgb(39, 38, 38);
          color: white;
          &:hover {
            background: white;
            color: rgb(39, 38, 38);
          }
        }
        .save_btn {
          border: 0.1px solid rgb(37, 37, 37);
          background: rgb(255, 255, 255);

          &:hover {
            background: rgb(0, 0, 0);
            color: rgb(255, 255, 255);
          }
        }
      }
    }
  }
  #add_mask {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 2;
    width: 100vw;
    height: 100vh;
    .back {
      width: 100%;
      height: 100%;
      background: rgba(181, 174, 174, 0.94);
    }
    .content {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 420px;
      background: white;
      border-radius: 1px;

      .double_item {
        display: flex;
        width: 80%;
        justify-content: space-between;
        margin-bottom: 18px;
        > div {
          width: 48%;
          > p:first-child {
            font-size: 14px;
            margin-bottom: 6px;
          }
          > p:last-child {
            display: flex;
            align-items: center;
            height: 25px;
            border: 1px solid rgb(222, 221, 221);
          }
          input {
            width: 80%;
            font-size: 20px;
            border-radius: 1px;
            margin-left: 5px;
            font-size: 16px;
          }
        }
      }
      .item {
        width: 80%;
        margin-bottom: 20px;
        > p:first-child {
          margin-bottom: 6px;
          font-size: 14px;
        }
        > p:last-child {
          display: flex;
          align-items: center;
          height: 30px;
          border: 1px solid rgb(222, 221, 221);
          border-radius: 1px;
          input {
            margin-left: 10px;
            width: 80%;
            font-size: 18px;
          }
        }
      }
      > div:nth-last-of-type(1) {
        margin-top: 15px;
        margin-bottom: 25px;
        width: 80%;
        display: flex;
        justify-content: flex-end;
        p {
          padding: 2px 10px;
          font-size: 15px;
          margin-left: 20px;
          border-radius: 1px;
          cursor: pointer;
          transition: all 0.5s;
        }

        .add_btn {
          border: 0.1px solid rgb(37, 37, 37);
          background: rgb(255, 255, 255);

          &:hover {
            background: rgb(0, 0, 0);
            color: rgb(255, 255, 255);
          }
        }
      }
    }
  }
  .show_mask-enter-active,
  .show_mask-leave-active,
  .add_mask-enter-active,
  .add_mask-leave-active {
    transition: all 0.2s;
  }
  .show_mask-enter-from,
  .show_mask-leave-to,
  .add_mask-enter-from,
  .add_mask-leave-to {
    opacity: 0;
    transform: translateX(-3px);
    filter: blur(1px);
  }
}
</style>