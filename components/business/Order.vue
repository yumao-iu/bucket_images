
<template>
  <div id="components_business_order">
    <div class="header">
      <div class="left">
        <p>
          <input
            type="text"
            placeholder="搜点什么吧 😅"
            v-model="search_text"
            @keyup.enter="search_trade"
          />
          <i class="yumao icon-sousuo" @click="search_trade"></i>
          <i class="yumao icon-dacha" @click="search_cancel"></i>
        </p>
      </div>
      <div class="right">
        <i class="failed" @click="filter_data(-1)">未完成</i>
        <i class="successed" @click="filter_data(1)">已完成</i>
        <i  @click="filter_data(200)">取消检索</i>
      </div>
    </div>
    <div class="content">
      <div class="title">
        <em class="title_01">编号</em>
        <em class="title_02">食物</em>
        <em class="title_03">用户</em>
        <em class="title_04">时间</em>
        <em class="title_05">价格</em>
        <em class="title_06">方式</em>
        <em class="title_07">评价</em>
        <em class="title_08">状态</em>
      </div>
      <div class="main">
        <div :class="'order_' + v.id" v-for="(v, i) in order_data" :key="i">
          <p class="tag_01">
            <i>{{ v.id }}</i>
          </p>
          <p class="tag_02">
            <i>{{ v.food_name }}</i>
          </p>
          <p class="tag_03">
            <i>{{ v.user_name }}</i>
          </p>
          <p class="tag_04">
            <i>{{ v.time }}</i>
          </p>
          <p class="tag_05">
            <i>{{ v.food_price }}</i>
          </p>
          <p class="tag_06">
            <i>{{ v.method }}</i>
          </p>
          <p class="tag_07">
            <i :title="v.estimate_text">{{ v.estimate_text }}</i>
          </p>
          <p class="tag_08">
            <i
              @click="look_status(v)"
              :class="v.status_text == '已完成' ? 'successed' : 'failed'"
              >{{ v.status_text }}</i
            >
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { indexStore } from "~/store";
import { storeToRefs } from "pinia";
import _ from "lodash";
import business_api from "~/axios/business";
import { businessStore } from "~/store/business";
let { show_select_status, trade_status, selected_trade, order_data } =
  storeToRefs(businessStore());

order_data = ref(await business_api.get_order());
let search_text = ref("");

if (order_data.value.length) {
  order_data.value.forEach((v) => {
    v.status_text = v.status == "-1" ? "未完成" : "已完成";
    if (v.estimate == 0) v.estimate_text = "未评价";
    else if (v.estimate == -1) v.estimate_text = "用户删除";
    else if (v.estimate == -2) v.estimate_text = "管理员删除";
    else if (v.estimate == 1) v.estimate_text = v.estimate_content;
  });
}

let look_status = (v) => {
  show_select_status.value = true;
  trade_status.value = v.status;
  selected_trade.value = v;
};
let search_trade = async () => {
  if ((await business_api.search_trade(search_text.value)).length)
    (order_data.value = await business_api.search_trade(search_text.value)),
      format_data();
  else alert("无数据 😀");
};
let search_cancel = async () => {
  order_data.value = await business_api.get_order();
  search_text.value = "";
  format_data();
};

let filter_data = async (index) => {
  order_data.value = await business_api.get_order(index)
  format_data()
};

let format_data = () => {
  if (order_data.value.length) {
    order_data.value.forEach((v) => {
      v.status_text = v.status == "-1" ? "未完成" : "已完成";
      if (v.estimate == 0) v.estimate_text = "未评价";
      else if (v.estimate == -1) v.estimate_text = "用户删除";
      else if (v.estimate == -2) v.estimate_text = "管理员删除";
      else if (v.estimate == 1) v.estimate_text = v.estimate_content;
    });
  }
};
</script>

<style lang="less">
#components_business_order {
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
        border: 1px solid rgb(241, 236, 236);
        transition: all 0.5s;

        &:hover {
          border: 1px solid rgb(136, 185, 241);
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
          color: rgb(187, 181, 181);
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
      i {
        color: rgb(48, 46, 46);
        cursor: pointer;
        transition: all 0.5s;
        margin: 0 10px;
      }
      .successed {
        color: green;
      }
      .failed {
        color: red;
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
        width: 5%;
      }
      .title_02 {
        width: 10%;
      }
      .title_03 {
        width: 10%;
      }
      .title_04 {
        width: 15%;
      }
      .title_05 {
        width: 8%;
      }
      .title_06 {
        width: 10%;
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
          width: 5%;
        }
        .tag_02 {
          width: 10%;
        }
        .tag_03 {
          width: 10%;
        }
        .tag_04 {
          width: 15%;
        }
        .tag_05 {
          width: 8%;
        }
        .tag_06 {
          width: 10%;
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
        .successed {
          color: green;
        }
        .failed {
          color: red;
        }
      }
    }
  }
}
</style>