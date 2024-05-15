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
        <UserLog v-else-if="click_index == 3" />
      </transition>
    </main>
    <Transition name="show_detail" tip="estimate" mode="out-in">
      <div id="show_estimate" v-show="show_estimate_index">
        <div class="back" @click="show_estimate"></div>
        <div class="content">
          <p class="title">菜品评价</p>
          <div class="main">
            <textarea
              v-model="current_edit_food.estimate_content"
              v-if="estimate_status"
              disabled
            ></textarea>
            <!-- 已经发送 -->
            <textarea v-model="v_model_estimate_text" v-else></textarea>
            <!-- 等待发送 -->
          </div>
          <div class="bottom">
            <em @click="send_estimate" v-if="!estimate_status">发送评价</em>
            <em class="del" v-else @click="estimate_delete">删除评价</em>
          </div>
          <span class="cancel" @click="show_estimate"
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
import { storeToRefs } from "pinia";
import api_user from "~/axios/user";

let { login_out, update_user, show_estimate } = userStore();
let {
  user_data,
  user_token,
  show_estimate_index,
  v_model_estimate_text,
  current_edit_food,
  estimate_status,
} = storeToRefs(userStore());
let click_index = ref(0);
let router = useRouter()

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
    icon: "icon-yundong",
    text: "账单",
  },
  {
    icon: "icon-wenjian",
    text: "日志",
  },
]);
let go_home = () => {
  router.push({path:'/'})
  // location.href = "/";
};
let send_estimate = async () => {
  if (v_model_estimate_text.value.replace(/\s+/, "") == "") return;
  let { code, message } = await api_user.send_estimate(
    v_model_estimate_text.value,
    current_edit_food.value
  );
  if (code == 200) {
    show_estimate_index.value = false;
    alert("发送成功！🥵");
  } else if (code == 500) alert("发送失败！你已经发送过了 🤡");
};
let estimate_delete = async () => {
  if (confirm("注意：删除后不能再进行评价操作🤯")) {
    let data = await api_user.estimate_delete(current_edit_food.value);
    show_estimate_index.value = false;
    alert('删除成功！🤯')
  }
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
  #show_estimate {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    z-index: 4;
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
      width: 450px;
      background: white;
      border-radius: 1px;
      p.title {
        margin-top: 30px;
        margin-bottom: 30px;
        font-size: 20px;
        text-align: center;
      }
      .main {
        width: 80%;
        overflow: auto;
        margin-bottom: 30px;
        max-height: 500px;
        display: flex;
        textarea {
          resize: none;
          transition: all 0.5s;
          width: 80%;
          height: 100px;
          border: 1px solid rgb(192, 185, 185);
          margin: 0 auto;
          border-radius: 1px;
          padding: 10px 10px;
          font-size: 20px;
        }
      }
      .bottom {
        display: flex;
        justify-content: flex-end;
        width: 70%;
        margin-bottom: 20px;
        em {
          cursor: pointer;
          font-size: 14px;
          margin-left: 10px;
        }
        em.del {
          color: red;
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
  .show_detail-enter-active,
  .show_detail-leave-active {
    transition: all 0.2s;
  }
  .show_detail-enter-from,
  .show_detail-leave-to {
    opacity: 0;
    filter: blur(1px);
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