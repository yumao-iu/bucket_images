<template>
  <div id="pages_user">
    <header>
      <div class="left">
        <em class="user_tag">用户:{{ user_data.name }}</em>
        <em class="user_price">余额:{{ user_data.price }}</em>
      </div>
      <div class="right">
        <em @click="go_home">首页</em>
        <em @click="login_out">退出</em>
      </div>
    </header>
    <section>
      <div class="content">
        <p
          v-for="(v, i) in navigation_select"
          :key="i"
          :class="i == click_index ? 'select_class' : ''"
          @click="click_index = i"
        >
          <i :class="'yumao ' + v.icon"></i><i>{{ v.text }}</i>
        </p>
      </div>
    </section>
    <main>
      <transition name="user_index" mode="out-in">
        <UserOrder v-if="click_index == 0" />
        <UserOther v-else-if="click_index == 1" />
        <UserMoney v-else-if="click_index == 2" />
      </transition>
    </main>
  </div>
</template>

<script setup>
import { indexStore } from "~/store";
import { userStore } from "~/store/user";
import { storeToRefs } from "pinia";

let { login_out, test, update_user } = userStore();
let { user_data, user_token } = storeToRefs(userStore());
let click_index = ref(0);
let navigation_select = ref([
  {
    icon: "icon-xuniji",
    text: "订单",
  },
  {
    icon: "icon-yundong",
    text: "信息",
  },
  {
    icon: "icon-wenjian",
    text: "账单",
  },
]);
let go_home = () => {
  location.href = "/";
};
update_user();
</script>
<style lang="less">
#pages_user {
  background: url("/images/user_bg.webp");
  background-size: 132% auto;
  background-repeat: no-repeat;
  height: 100vh;
  header {
    width: 100%;
    height: 65px;
    min-width: 1280px;
    // box-shadow: 0 1px 1px 1px rgba(169, 166, 166, 0.2);
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 25px;
    background: white;
    > div {
      width: 40%;
      height: 80%;
      display: flex;
      align-items: center;
    }
    .left {
      color: rgb(14, 13, 13);
      em {
        margin-right: 35px;
      }

      .add_price {
        transition: all 0.5s;
        cursor: pointer;
        &:hover {
          color: rgb(41, 173, 225);
        }
      }
    }
    .right {
      justify-content: flex-end;
      em {
        color: rgb(56, 54, 54);
        cursor: pointer;
        margin-left: 35px;
      }
    }
  }
  section {
    background: white;
    width: 90%;
    height: 60px;
    margin: 0 auto;
    margin-bottom: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 2px;
    .content {
      width: 89%;
      height: inherit;
      display: flex;
      align-items: center;

      p {
        cursor: pointer;
        display: flex;
        align-items: center;
        padding: 10px 10px;
        border-radius: 2px;
        margin-right: 20px;
        transition: all 0.2s;
        color: gray;
        i {
          margin: 0 2px;
        }
        &:not(.select_class):hover {
          background: rgb(249, 246, 245);
        }
      }
      .select_class {
        color: white;
        box-shadow: 0 0 1px 3px rgba(62, 182, 194, 0.1);
        background: linear-gradient(
          45deg,
          rgba(62, 182, 194, 0.8),
          rgba(62, 182, 194, 0.6)
        );
      }
      i[class^="yumao"] {
        font-size: 20px;
      }
    }
  }
  main {
    width: 90%;
    height: 500px;
    margin: 0 auto;
    i[class^="yumao"] {
        font-size: 22px;
        color: rgb(110, 101, 101);
      }
    > div {
      border-radius: 2px;
      width: 100%;
      height: inherit;
    }
  }
  .user_index-enter-active,
  .user_index-leave-active {
    transition: all 0.3s;
  }
  .user_index-enter-from,
  .user_index-leave-to {
    opacity: 0;
    transform: scale(1.005);
    // filter: blur(1px);
  }
}
</style>