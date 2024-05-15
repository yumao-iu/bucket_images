<template>
  <div id="UserLog">
    <div class="header">
      <div class="left">
        <p>
          <input
            type="text"
            placeholder="搜点什么吧 😅"
            v-model="search_text"
            @keyup.enter="search_log"
          />
          <i class="yumao icon-sousuo" @click="search_log"></i>
          <i class="yumao icon-dacha" @click="search_cancel"></i>
        </p>
      </div>
      <div class="right"></div>
    </div>
    <div class="content">
      <div class="title">
        <em class="title_01">编号</em>
        <em class="title_02">日志</em>
        <em class="title_03">时间</em>
        <em class="title_04">地点</em>
        <em class="title_05">设备</em>
      </div>
      <div class="main">
        <div :class="'order_' + v.id" v-for="(v, i) in data" :key="i">
          <p class="tag_01">
            <i>{{ v.id }}</i>
          </p>
          <p class="tag_02">
            <i>{{ v.content }}</i>
          </p>
          <p class="tag_03">
            <i>{{ v.time }}</i>
          </p>
          <p class="tag_04">
            <i :title="v.ip">{{ v.ip }}</i>
          </p>
          <p class="tag_05">
            <i :title="v.device">{{ v.device }}</i>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import user_api from "~/axios/user";

let data = ref(await user_api.get_log());
let search_text = ref("");

let search_log = async () => {
  if ((await user_api.search_log(search_text.value)).length)
    data.value = await user_api.search_log(search_text.value);
  else alert("无数据 😀");
};
let search_cancel = async () => {
  data.value = await user_api.get_log("");
  search_text.value = "";
};
</script>

<style lang="less">
#UserLog {
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
          border: 1px solid rgb(151, 171, 235);
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
          margin-left: 6px;
          cursor: pointer;
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
        width: 5%;
      }
      .title_02 {
        width: 10%;
      }
      .title_03 {
        width: 13%;
      }
      .title_04 {
        width: 20%;
      }
      .title_05 {
        width: 40%;
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
          width: 13%;
        }
        .tag_04 {
          width: 20%;
        }
        .tag_05 {
          width: 40%;
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