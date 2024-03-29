<template>
  <div id="pages_index">
    <header>
      <div id="head_back">
        <div id="head_left">
          <img src="/images/xiaohui.jpg" />
          <p>广西科技大学食堂信息管理系统</p>
        </div>
        <div id="head_right">
          <div class="top">
            <em>
              <i @click="login_out"
                >{{ user_data.value ? "未登录" : user_data.price }} 调试清除</i
              >
              <i @click="go_user">用户页面</i>
              <i @click="go_school">学校官网</i
              ><i @click="show_search = true">搜索菜品</i
              ><i @click="go_login">快速登录</i></em
            >
          </div>
          <div class="bottom">
            <p><i>求真近道</i> <i>明德致新</i></p>
          </div>
        </div>
        <img src="/images/03.jpg" />
      </div>
    </header>
    <section>
      <div class="content">
        <div id="swiper-container">
          <div class="title_01">
            <img src="/images/icon_01.png" />
            <p>科大宣传</p>
          </div>
          <Swiper
            :modules="[SwiperAutoplay, SwiperPagination]"
            :slides-per-view="1"
            :loop="true"
            :pagination="{
              el: '.swiper-pagination',
              clickable: true,
            }"
            :autoplay="{
              delay: 5000,
            }"
          >
            <SwiperSlide v-for="(v, i) in swiper" :key="i">
              <img :src="'/images/' + v.img" />
            </SwiperSlide>
            <div class="swiper-pagination"></div>
          </Swiper>
        </div>
        <div id="news-container">
          <div class="title_02">
            <img src="/images/icon_04.png" />
            <p>科大要闻</p>
          </div>
          <div id="new-container">
            <div
              :class="'new_' + v.id"
              v-for="(v, i) in news"
              :key="i"
              @click="go_news(v.link)"
            >
              <i class="yumao icon-youjiantou"></i><i>{{ v.title }}</i>
            </div>
          </div>
        </div>
      </div>
    </section>
    <footer>
      <div class="left">
        <div class="title">
          <img src="/images/icon_02.png" />
          <p>热门菜品</p>
        </div>
        <div class="content">
          <div
            :class="'card_' + v.id"
            v-for="(v, i) in food"
            :key="i"
            @click="go_food(v)"
          >
            <img :src="'/images/' + v.img" />
            <p>{{ v.name }}</p>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="title">
          <img src="/images/icon_03.png" />
          <p>其他信息</p>
        </div>
        <div class="content">
          <pre v-for="(v, i) in detail" :key="i">{{ v.content }}</pre>
        </div>
      </div>
    </footer>
    <Transition name="show_detail" tip="detail" mode="out-in">
      <KeepAlive>
        <div id="show_detail" v-show="show_food">
          <div class="back" @click="show_food = false"></div>
          <div class="content">
            <img :src="'/images/' + current_food.img" />
            <p>
              <em>菜品名称:</em><em> {{ current_food.name }}</em>
            </p>
            <p>
              <em>菜品价格:</em><em> {{ current_food.price }}</em>
            </p>
            <p>
              <em>菜品位置:</em><em> {{ current_food.localtion }}</em>
            </p>
            <p>
              <em>菜品原料:</em><em> {{ current_food.detail }}</em>
            </p>
            <p>
              <em>菜品介绍:</em><em> {{ current_food.introduce }}</em>
            </p>
            <em
              ><i class="code_btn" @click="code_buy">扫码购买</i
              ><i class="balance_btn" @click="balance_buy">余额购买</i></em
            >
            <span class="cancel" @click="show_food = false"
              ><i class="yumao icon-dacha"></i
            ></span>
          </div>
        </div>
      </KeepAlive>
    </Transition>
    <Transition name="show_detail" tip="search" mode="out-in">
      <KeepAlive>
        <div id="show_search" v-show="show_search">
          <div class="back" @click="cancel_search"></div>
          <div class="content">
            <p class="search">
              <input
              id="search_inp"
                type="text"
                maxlength="20"
                placeholder="搜索点什么吧🤯"
                v-model="search_text"
                @input="filter_digit"
                @keyup.enter="search_food"
              /><em class="yumao icon-sousuo" @click="search_food"></em>
            </p>
            <div class="search_content">
              <p
                :class="'food_' + v.id"
                v-for="(v, i) in search_result"
                :key="i"
                @click="go_food(v)"
              >
                <img :src="'/images/' + v.img" />
                <i>{{ v.name }}</i>
              </p>
            </div>
            <span class="cancel" @click="cancel_search"
              ><i class="yumao icon-dacha"></i
            ></span>
          </div>
        </div>
      </KeepAlive>
    </Transition>
    <Transition name="show_detail" tip="code" mode="out-in">
      <div id="show_code" v-show="show_code">
        <div class="back" @click="show_code = false"></div>
        <div class="content">
          <p><img :src="qrcode_img" /></p>
          <span class="cancel" @click="show_code = false"
            ><i class="yumao icon-dacha"></i
          ></span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { indexStore } from "~/store";
import { userStore } from "~/store/user";
import { adminStore } from "~/store/admin";
import { storeToRefs } from "pinia";
import qrcode from "qrcode";
import _ from "lodash";
import index_api from "~/axios";
import user_api from "~/axios/user";
import user from "~/axios/user";
let { debounce } = _;

let { init_data } = storeToRefs(indexStore());
let { update_user, login_out } = userStore();
let { user_data, user_token } = storeToRefs(userStore());
let { admin_data, admin_token } = storeToRefs(adminStore());
let { food, swiper, detail, news } = init_data.value;
let show_search = ref(false);
let show_food = ref(false);
let show_code = ref(false);
let current_food = ref({});
let search_result = reactive({});
let search_text = ref(null);
let qrcode_img = ref("/images/qrcode.png");
let timer = null;

let go_user = () => {
  location.href = "/user";
};
let go_school = () => {
  window.open("https://www.gxust.edu.cn/");
};
let go_login = async () => {
  await navigateTo("/login");
};
let go_news = (v) => {
  window.open(v);
};
let go_food = (v) => {
  show_food.value = true;
  current_food = v;
};
let cancel_search = () => {
  show_search.value = false;
  search_result = {};
};
let filter_digit = () => {
  search_text.value = search_text.value.replace(/\s+/g, "");
};
let code_buy = async () => {
  if (!user_data.value) {
    alert("请先登录 🤡");
    return;
  }
  show_code.value = true;
  let { data } = await index_api.pay("pay", current_food);
  let { qrCode, outTradeNo } = data;
  let finish = 0;
  qrcode_img.value = await qrcode.toDataURL(qrCode);
  timer = setInterval(async () => {
    finish = await check_finish(outTradeNo);
    if (finish) code_buy_success({ outTradeNo });
  }, 2000);
};
let code_buy_success = async () => {
  clearInterval(timer);
  alert("支付成功！ 😅");
  show_code.value = false;
};
let balance_buy = async () => {
  if (!user_data.value) {
    alert("请先登录 🤡");
    return;
  }
  if (user_data.value.price < current_food.price) {
    alert("余额不足 🤡,剩余余额:" + user_data.value.price);
    return;
  }
  let { data, token } = await user_api.balance_pay(current_food.id);
  alert("购买成功！😅");
  show_food.value = false;
  update_user();
};
let check_finish = async (trade) => {
  current_food.uid = user_data.value.id;
  let flag = 0;
  let { data } = await index_api.pay("query", { trade, info: current_food });
  let { code, tradeStatus } = data;
  if (code == "10000" && tradeStatus == "TRADE_SUCCESS") flag = 1;
  return flag;
};
let search_food = debounce(async () => {
  if (!search_text.value) return 0;
  let data = reactive(await index_api.search_food(search_text.value));
  if (data.length) {
    search_result = data;
    search_text.value = null;
  } else alert("无搜索结果");
}, 500);
</script>

<style lang='less'>
#pages_index {
  .swiper-pagination {
    width: 100px;
    height: 30px;
  }
  header {
    margin-bottom: 30px;
    #head_back {
      width: 100%;
      height: 100px;
      max-width: 1420px;
      margin: 0 auto;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      > img {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        height: 100%;
        opacity: 0.35;
        z-index: -1;
      }
      > div {
        width: 48%;
      }
      #head_left {
        height: 80px;
        margin-right: 10px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        img {
          width: 70px;
          height: 70px;
          margin-left: 40px;
          margin-right: 30px;
        }
        p {
          font-size: 20px;
          // color: rgb(14, 61, 218);
        }
      }
      #head_right {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        height: 85px;
        .top {
          cursor: pointer;
          border: 0.001px solid transparent;
          display: flex;
          margin-bottom: 15px;
          em {
            margin: 10px 25px 0 10px;
            display: flex;
            i {
              margin-left: 15px;
              &:hover {
                color: rgb(96, 96, 103);
              }
              color: gray;
              transition: all 0.5s;
              font-size: 17px;
            }
          }
        }
        .bottom {
          margin-right: 23.5px;
          i {
            font-size: 30px;
            margin-left: 20px;
            color: rgba(202, 214, 239, 0.8);
          }
        }
      }
    }
  }
  section {
    width: 1282px;
    margin: 0 auto;
    margin-bottom: 40px;

    .content {
      width: 100%;
      display: flex;
      justify-content: space-between;
      > div {
        height: 100%;
      }
      #swiper-container {
        position: relative;
        display: flex;
        flex-direction: column;
        width: 54%;
        height: 100%;
        .title_01 {
          display: flex;
          align-items: center;
          height: 60px;
          margin-bottom: 10px;
          img {
            margin-right: 20px;
          }
          p {
            font-size: 22px;
          }
        }
        .swiper {
          border-radius: 3px;
          width: 100%;
          height: 200px;
          .swiper-slide {
            img {
              border-radius: 3px;
              width: 100%;
              height: 100%;
            }
          }
        }
        .swiper-pagination {
          position: absolute;
          bottom: 5px;
          width: 95%;
          left: 50%;
          transform: translateX(-50%);
          // border: 1px solid red;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          > span {
            width: 20px;
            height: 20px;
            line-height: 20px;
            background: url("/images/xiaohui.jpg");
            background-size: 100% 100%;
            background-repeat: no-repeat;
            margin-left: 5px;
          }
        }
      }
      #news-container {
        width: 42%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .title_02 {
          display: flex;
          align-items: center;
          height: 60px;
          img {
            margin-right: 20px;
          }
          p {
            font-size: 22px;
          }
        }
        #new-container {
          > div[class^="new_"] {
            display: flex;
            align-items: center;
            cursor: pointer;
            height: 35px;
            border-bottom: 1px solid rgba(237, 226, 226, 0.5);
            transition: all 0.5s;

            &:hover {
              border-bottom: 1px solid rgba(237, 226, 226, 0.9);
            }
            &:hover .yumao {
              color: rgba(62, 112, 248, 0.9);
            }
            .yumao {
              transition: all 0.5s;
              font-size: 19px;
              margin-right: 6px;
              color: rgba(62, 112, 248, 0.5);
            }
            i {
              &:hover {
                color: rgb(13, 13, 13);
              }
              transition: all 0.5s;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              color: rgb(76, 73, 73);
            }
          }
          > div[class^="new_"]:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
  }
  footer {
    width: 1282px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;

    .left {
      width: 55%;
      .title {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        img {
          margin-right: 20px;
        }
        p {
          margin-top: 3px;
          font-size: 22px;
        }
      }
      .content {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        > div {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          height: 85px;
          width: 85px;
          margin-right: 32px;
          margin-bottom: 20px;

          &:hover p {
            color: gray;
          }
          img {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            margin-bottom: 10px;
          }
          p {
            transition: all 0.2s;
            color: black;
            font-size: 12px;
          }
        }
        > div:nth-child(n + 6) {
          margin-bottom: 0;
        }
      }
    }
    .right {
      width: 41.5%;
      .title {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        img {
          margin-right: 20px;
        }
        p {
          margin-top: 3px;
          font-size: 22px;
        }
      }
      .content {
        width: 100%;
        height: 100px;
        pre {
          margin-bottom: 21px;
          color: rgb(76, 73, 73);
        }
        pre:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
  #show_detail {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    z-index: 3;
    .back {
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(181, 174, 174, 0.94);
    }
    .content {
      position: absolute;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 400px;
      background: white;
      border-radius: 1px;
      img {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        margin-top: 40px;
        margin-bottom: 30px;
      }
      p {
        width: 80%;
        margin-bottom: 18px;
        display: flex;
        em {
          margin-right: 10px;
          &:last-child {
            margin: 0;
          }
          &:nth-child(1) {
            width: 24%;
            line-height: 25px;
          }
          &:nth-child(2) {
            width: 70%;
            line-height: 25px;
          }
        }
        &:nth-last-of-type(1) {
          margin: 0;
          margin-bottom: 50px;
        }
      }
      P:nth-last-of-type(1) {
        margin-bottom: 25px;
      }
      > em {
        display: flex;
        justify-content: flex-end;
        width: 100%;
        margin-bottom: 20px;
        i {
          margin-right: 20px;
          cursor: pointer;
          color: rgb(24, 24, 24);
          transition: all 0.5s;
          padding: 3px 10px;
          font-size: 14px;
          border-radius: 2px;
        }
        .code_btn {
          color: rgb(49, 73, 154);
          border: 1px solid rgb(49, 73, 154);
        }
        .balance_btn {
          background: rgb(49, 73, 154);
          color: white;
        }
      }
      .cancel {
        position: absolute;
        top: -8px;
        right: -8px;
        width: 25px;
        height: 25px;
        transition: all 0.4s;
        cursor: pointer;
        background: white;
        box-shadow: 0 0 1px 1px rgba(53, 52, 52, 0.1);
        border-radius: 1px;
        display: flex;
        justify-content: center;
        align-items: center;
        &:hover {
          transform: translate(-5px, 5px);
        }
        i {
          font-size: 19px;
          color: rgb(55, 181, 193);
        }
      }
    }
  }
  #show_search {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    z-index: 2;
    .back {
      position: absolute;
      top: 0;
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
      width: 600px;
      height: 500px;
      background: white;
      border-radius: 1px;
      .search {
        width: 80%;
        height: 38px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 35px;
        border: 1px solid rgb(235, 229, 229);
        transition: all 0.5s;
        border-radius: 1px;
        margin-bottom: 30px;
        &:hover {
          border: 1px solid rgb(203, 197, 197);
        }
        input {
          width: 85%;
          font-size: 20px;
          margin: 0 10px;
          color: rgb(73, 71, 71);
        }
        input::-webkit-input-placeholder {
          font-size: 15px;
        }
        .yumao {
          color: rgb(161, 159, 159);
          font-size: 20px;
          cursor: pointer;
        }
      }
      .search_content {
        display: flex;
        flex-wrap: wrap;
        width: 80%;
        max-height: 350px;
        overflow: auto;
        > p[class^="food"] {
          height: 90px;
          width: 75px;
          // border: 1px solid red;
          margin-right: 19.5px;
          margin-bottom: 35px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          cursor: pointer;
          img {
            margin-bottom: 10px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
          }
          i {
            font-size: 13px;
            color: rgb(76, 74, 74);
          }
        }
      }
      .cancel {
        position: absolute;
        top: -8px;
        right: -8px;
        width: 25px;
        height: 25px;
        transition: all 0.4s;
        cursor: pointer;
        background: white;
        box-shadow: 0 0 1px 1px rgba(53, 52, 52, 0.1);
        border-radius: 1px;
        display: flex;
        justify-content: center;
        align-items: center;
        &:hover {
          transform: translate(-5px, 5px);
        }
        i {
          font-size: 19px;
          color: rgb(55, 181, 193);
        }
      }
    }
  }
  #show_code {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    z-index: 3;
    .back {
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(181, 174, 174, 0.94);
    }
    .content {
      position: absolute;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 250px;
      background: white;
      border-radius: 1px;
      img {
        width: 200px;
        height: 200px;
        margin-top: 40px;
        margin-bottom: 30px;
      }
      .cancel {
        position: absolute;
        top: -8px;
        right: -8px;
        width: 25px;
        height: 25px;
        transition: all 0.4s;
        cursor: pointer;
        background: white;
        box-shadow: 0 0 1px 1px rgba(53, 52, 52, 0.1);
        border-radius: 1px;
        display: flex;
        justify-content: center;
        align-items: center;
        &:hover {
          transform: translate(-5px, 5px);
        }
        i {
          font-size: 19px;
          color: rgb(55, 181, 193);
        }
      }
    }
  }
  .show_detail-enter-active,
  .show_detail-leave-active {
    transition: all 0.2s;
  }
  .show_detail-enter-from,
  .show_detail-leave-to {
    opacity: 0;
    filter: blur(1px);
  }
}
</style>
