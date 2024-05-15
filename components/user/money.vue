<template>
  <div id="UserMoney">
    <div class="header">
      <div class="left">
        <p>
          <input
            type="text"
            placeholder="搜点什么吧 😅"
            v-model="search_text"
            @keyup.enter="search_bill"
          />
          <i class="yumao icon-sousuo" @click="search_bill"></i>
          <i class="yumao icon-dacha" @click="search_cancel"></i>
        </p>
      </div>
      <div class="right">
        <!-- <i>添加</i> -->
      </div>
    </div>
    <div class="content">
      <div class="title">
        <em class="title_01">编号点</em>
        <em class="title_02">时间点</em>
        <em class="title_03">使用点</em>
        <em class="title_04">旧数据</em>
        <em class="title_05">新数据</em>
        <em class="title_06">新变化</em>
      </div>
      <div class="main">
        <div :class="'order_' + v.id" v-for="(v, i) in data" :key="i">
          <p class="tag_01">
            <i>{{ v.id }}</i>
          </p>
          <p class="tag_02">
            <i>{{ v.time }}</i>
          </p>
          <p class="tag_03">
            <i>{{ v.type }}</i>
          </p>
          <p class="tag_04">
            <i>{{ v.old_price }}</i>
          </p>
          <p class="tag_05">
            <i>{{ v.new_price }}</i>
          </p>
          <p class="tag_07">
            <i>{{ v.change_price }}</i>
          </p>
          <p class="tag_06" @click="show_estimate(v)">
            <i>{{ v.estimate_text }}</i>
          </p>
        </div>
      </div>
    </div>
    <!-- <div class="footer"></div> -->
  </div>
</template>


<script setup>
import { indexStore } from "~/store";
import { userStore } from "~/store/user";
import { adminStore } from "~/store/admin";
import { storeToRefs } from "pinia";
import _ from "lodash";
import user_api from "~/axios/user";
let { debounce } = _;

let { init_data } = storeToRefs(indexStore());
let { update_data, login_out, show_estimate } = userStore();
let { user_data, user_token } = storeToRefs(userStore());
let { admin_data, admin_token } = storeToRefs(adminStore());
let data = ref(await user_api.get_bill());
let search_text = ref("");

let search_bill = async () => {
  if (!(await user_api.search_bill(search_text.value)).length)
    alert("无数据 😅");
  else data.value = await user_api.search_bill(search_text.value);
};
let search_cancel = async () => {
  search_text.value = "";
  data.value = await user_api.search_bill(search_text.value);
};
</script>

<style lang="less">
#UserMoney {
  background: white;
  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px auto 15px auto;
    height: 60px;
    > div {
      width: 45%;
      height: inherit;
      margin-top: 15px;
    }
    .left {
      display: flex;
      align-items: center;
      > p {
        margin-left: 7px;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 50%;
        border-radius: 2px;
        width: 250px;
        border: 1px solid rgb(229, 222, 222);
        transition: all 0.5s;
        &:hover {
          border: 1px solid rgb(117, 159, 243);
        }
        input {
          width: 70%;
          font-size: 18px;
          color: rgb(61, 58, 58);
        }
        input::-webkit-input-placeholder {
          font-size: 15px;
        }
        i {
          color: gray;
          cursor: pointer;
          margin-left: 6px;
        }
        .icon-sousuo {
          margin-right: 5px;
          font-size: 16px !important;
        }
        .icon-dacha {
          font-size: 16px !important;
        }
      }
    }
    .right {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      //   border: 1px solid red;
      i {
        color: rgb(48, 46, 46);
        cursor: pointer;
        transition: all 0.5s;
      }
    }
  }
  .content {
    width: 89%;
    height: 375px;
    margin: 0 auto;
    color: rgb(44, 43, 43);
    font-size: 15.5px;
    .title {
      display: flex;
      align-items: center;
      width: 100%;
      height: 40px;
      border-bottom: 1px solid rgba(242, 236, 236, 0.9);
      .title_01 {
        width: 8%;
      }
      .title_02 {
        width: 20%;
      }
      .title_03 {
        width: 15%;
      }
      .title_04 {
        width: 12%;
      }
      .title_05 {
        width: 8%;
      }
      .title_07 {
        width: 8%;
      }
      em {
        margin-right: 20px;
        line-height: 40px;
        height: 100%;
      }
    }
    .main {
      overflow: auto;
      height: 90%;
      width: 100%;
      margin: 0 auto;
      > div {
        height: 35px;
        display: flex;
        margin-bottom: 5px;
        border-bottom: 1px solid rgb(242, 239, 239);
        transition: all 0.5s;
        background: white;

        &:hover {
          background: rgb(250, 250, 250);
        }
        .tag_01 {
          width: 8%;
        }
        .tag_02 {
          width: 20%;
        }
        .tag_03 {
          width: 15%;
        }
        .tag_04 {
          width: 12%;
        }
        .tag_05 {
          width: 8%;
        }
        .tag_07 {
          width: 8%;
        }

        > p {
          margin-right: 20px;
          display: flex;
          align-items: center;
          i {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        > p:last-child {
          i {
            transition: all 0.2s;
            margin-right: 20px;
            cursor: pointer;
            &:hover {
              color: rgb(33, 121, 156);
            }
          }
        }
      }
    }
  }
}
</style>