<template>
  <div id="pages_business">
    <header>
      <div class="left">
        <em class="user_tag">商家: {{ data_business.name }}</em>
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
        <BusinessOrder v-if="click_index == 0" />
        <BusinessFood v-else-if="click_index == 1" />
        <BusinessOther v-else-if="click_index == 2" />
      </transition>
    </main>
    <div id="select_status" v-show="show_select_status">
      <div class="back" @click="show_select_status = false"></div>
      <div class="main">
        <p class="title">选择订单状态</p>
        <p class="list">
          <em
            :class="trade_status == '-1' ? 'selected_class' : 'none'"
            @click="set_trade_status('-1')"
            >未完成</em
          ><em
            :class="trade_status == '1' ? 'selected_class' : 'none'"
            @click="set_trade_status('1')"
            >已完成</em
          >
        </p>
      </div>
    </div>
  </div>
</template>
  
  <script setup>
import { businessStore } from "~/store/business";
import { storeToRefs } from "pinia";
import business_api from "~/axios/business";

let { login_out } = businessStore();
let {
  show_select_status,
  trade_status,
  selected_trade,
  data_business,
  order_data,
} = storeToRefs(businessStore());
let click_index = ref(0);
let router = useRouter();

let navigation_select = ref([
  {
    icon: "icon-xuniji",
    text: "订单",
  },
  {
    icon: "icon-yundong",
    text: "菜品",
  },
  {
    icon: "icon-yundong",
    text: "其他",
  },
]);
let go_home = () => {
  router.push({ path: "/" });
};
let set_trade_status = async (index) => {
  if (index == selected_trade.value.status) return;
  await business_api.set_trade_status(selected_trade.value);
  show_select_status.value = false;
  
  console.log(order_data);
  alert("修改成功！🥰");
};
</script>

  <style lang="less">
#pages_business {
  background: url("/images/business_bg.webp");
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
  #select_status {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 4;
    .back {
      position: absolute;
      background: rgba(181, 174, 174, 0.8);
      width: 100%;
      height: 100%;
    }
    .main {
      display: flex;
      align-items: center;
      flex-direction: column;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 420px;
      height: 150px;
      background: white;
      border-radius: 2px;
      .title {
        margin-top: 20px;
        margin-bottom: 45px;
      }
      .list {
        em {
          margin: 0 25px;
          cursor: pointer;
          transition: all 0.8s;
          border: 1px solid transparent;
          padding: 3px 14px;
          &:hover {
            border: 1px solid gray;
          }
        }

        .selected_class {
          border: 1px solid gray;
        }
      }
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