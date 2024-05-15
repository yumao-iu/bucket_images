
<template>
  <div id="BusinessSet">
    <div class="title">
      <div class="left">
        <p>
          <input
            type="text"
            placeholder="搜点什么吧😋"
            v-model="search_text"
            maxlength="19"
            @keydown.enter="search_business"
            @input="filter_s"
          />
          <i class="yumao icon-sousuo" @click="search_business"></i>
          <i class="yumao icon-dacha" @click="search_cancel"></i>
        </p>
      </div>
      <div class="right">
        <p class="add_food" @click="show_add_business">添加</p>
      </div>
    </div>
    <div class="content">
      <div class="header">
        <p><em></em><em>编号</em></p>
        <p><em></em><em>名称</em></p>
        <p><em></em><em>账号</em></p>
        <p><em></em><em>电话</em></p>
        <p><em></em><em>操作</em></p>
      </div>
      <div class="main">
        <div :id="'business_' + v.id" v-for="v in data" :key="v">
          <p>
            <em>{{ v.id }}</em>
          </p>
          <p>
            <em>{{ v.name }}</em>
          </p>
          <p>
            <em>{{ v.user }}</em>
          </p>
          <p>
            <em>{{ v.tel }}</em>
          </p>
          <p class="fn_btn">
            <em class="other_btn" @click="more_business(v)"><i>编辑</i></em>
          </p>
        </div>
      </div>
    </div>
    <Transition extra="添加" name="show_mask" mode="out-in">
      <div id="show_mask" v-show="show_mask">
        <div class="back" @click="show_mask = 0"></div>
        <div class="content">
          <div class="item">
            <p>昵称</p>
            <p>
              <input type="text" v-model="add_business_data.name" />
            </p>
          </div>
          <div class="item">
            <p>账号</p>
            <p>
              <input type="text" v-model="add_business_data.user" />
            </p>
          </div>
          <div class="item">
            <p>密码</p>
            <p>
              <input type="text" v-model="add_business_data.pass" />
            </p>
          </div>
          <div class="item">
            <p>电话</p>
            <p>
              <input type="text" v-model="add_business_data.tel" />
            </p>
          </div>
          <div class="item">
            <p>负责人</p>
            <p>
              <input type="text" v-model="add_business_data.people" />
            </p>
          </div>
          <div>
            <p class="save_btn" @click="add_business">添加</p>
          </div>
        </div>
      </div>
    </Transition>
    <Transition extra="编辑" name="add_mask" mode="out-in">
      <div id="add_mask" v-show="add_mask">
        <div class="back" @click="add_mask = 0"></div>
        <div class="content">
          <div class="item">
            <p>昵称</p>
            <p>
              <input type="text" v-model="edit_businesss_data.name" />
            </p>
          </div>
          <div class="item">
            <p>账号</p>
            <p>
              <input type="text" v-model="edit_businesss_data.user" />
            </p>
          </div>
          <div class="item">
            <p>密码</p>
            <p>
              <input type="text" v-model="edit_businesss_data.pass" />
            </p>
          </div>
          <div class="item">
            <p>电话</p>
            <p>
              <input type="text" v-model="edit_businesss_data.tel" />
            </p>
          </div>
          <div class="item">
            <p>负责人</p>
            <p>
              <input type="text" v-model="edit_businesss_data.people" />
            </p>
          </div>
          <div>
            <p class="delete_btn" @click="delete_business">删除</p>
            <p class="save_btn" @click="save_business">保存</p>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
  
<script setup>
import _ from "lodash";
import api from "~/axios/admin";

let data = ref(await api.get_business());
let show_mask = ref(0);
let add_mask = ref(0);
let search_text = ref("");
let add_business_data = ref({
  name: "",
  user: "",
  pass: "",
  tel: "",
  people: "",
});
let edit_businesss_data = ref("");

let search_business = async () => {
  if ((await api.search_business(search_text.value)).length)
    data.value = await api.search_business(search_text.value);
  else alert("搜索无结果 🤡");
};
let search_cancel = async () => {
  data.value = await api.get_business();
  search_text.value = "";
};
let show_add_business = () => {
  show_mask.value = 1;
};
let add_business = async () => {
  let { code } = await api.add_business(add_business_data.value);
  if (code == 300) alert("昵称已经存在🤡 ");
  else if (code == 500) alert("账号已经存在🤡 ");
  else if (code == 200)
    alert("添加成功🥳"),
      (show_mask.value = 0),
      (data.value = await api.get_business());
};
let more_business = (v) => {
  add_mask.value = 1;
  edit_businesss_data.value = v;
};
let save_business = async () => {
  let { code } = await api.save_business(edit_businesss_data.value);
  if (code == 300) alert("昵称已经存在🤡 ");
  else if (code == 500) alert("账号已经存在🤡 ");
  else if (code == 200)
    alert("添加成功🥳"),
      (add_mask.value = 0),
      (data.value = await api.get_business());
};
let delete_business = async () => {
  if (confirm("确定删除？🤔")) {
    await api.delete_business(edit_businesss_data.value);
    add_mask.value = 0;
    data.value = await api.get_business();
    alert("删除成功🥳");
  }
};
let filter_s = async () => {
  search_text.value = search_text.value.replace(/\s+/g, "");
};
</script>
  
  
<style lang="less">
#BusinessSet {
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
      .add_food {
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
        width: 22.5%;
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
      > div[id^="business_"] {
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
        > p:not(.fn_btn) {
          display: flex;
          width: 22.5%;
          height: 35px;
          line-height: 35px;
          em {
            padding: 0 18px;
            width: 100%;
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
          width: 22.5%;
          em {
            display: flex;
            padding: 0 13px;
            cursor: pointer;
            height: 25px;
            line-height: 27px;
            font-size: 16px;
            border-radius: 2px;
            transition: all 0.3s;
            &:hover {
              color: rgb(60, 189, 240);
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

      .img {
        margin-bottom: 30px;
        margin-top: 35px;
        img {
          cursor: pointer;
          width: 80px;
          height: 80px;
          border-radius: 50%;
        }
      }
      .item:nth-of-type(1) {
        margin-top: 40px;
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
            width: 92%;
            font-size: 15px;
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

      .item:nth-of-type(1) {
        margin-top: 35px;
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
            width: 92%;
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