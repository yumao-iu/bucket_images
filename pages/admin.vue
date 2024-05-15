<template>
  <body id="pages_admin">
    <header>
      <div class="left"></div>
      <div class="right">
        <em class="index_btn" @click="go_index">首页</em>
        <em class="out_btn" @click="login_out">退出</em>
      </div>
    </header>
    <main>
      <Transition name="admin_index" mode="out-in">
        <AdminFrontSet v-if="section_index == 0" />
        <AdminFoodSet v-else-if="section_index == 1" />
        <AdminTradeSet v-else-if="section_index == 2" />
        <AdminStaffSet v-else-if="section_index == 3" />
        <AdminUserSet v-else-if="section_index == 4" />
        <AdminBusinessSet v-else-if="section_index == 5" />
        <AdminWebSet v-else-if="section_index == 6" />
      </Transition>
    </main>
    <section>
      <img src="/images/xiaohui.jpg" />
      <p
        v-for="(v, i) in section_obj"
        :key="i"
        @click="set_index(i)"
        :class="section_index == i ? 'click_class' : 0"
      >
        <em :class="'yumao ' + v.icon"></em><em>{{ v.name }}</em>
      </p>
    </section>
  </body>
</template>

<script setup>
import { indexStore } from "~/store";
import { adminStore } from "~/store/admin";
import { storeToRefs } from "pinia";
import _ from "lodash";
import api from "~/axios";

let { login_out } = adminStore();
let router = useRouter();
let section_index = ref(0);
let section_obj = reactive([
  {
    icon: "icon-faxian",
    name: "首页设置",
  },
  {
    icon: "icon-fapiaoguanli",
    name: "菜品管理",
  },
  {
    icon: "icon-yonghu",
    name: "订单管理",
  },
  {
    icon: "icon-shequ",
    name: "人员管理",
  },
  {
    icon: "icon-yonghu",
    name: "用户管理",
  },
  {
    icon: "icon-yonghu",
    name: "商家管理",
  },
  {
    icon: "icon-jiekouzhongxin",
    name: "网站设置",
  },
]);

let set_index = (i) => {
  section_index.value = i;
};
let go_index = () => {
  router.push({ path: "/" });
};

onMounted(() => {
  let token = localStorage.getItem("admin_token");
  if (!token) router.push({ path: "/" });
});
</script>

<style lang="less" scoped>
#pages_admin {
  position: relative;
  background: rgb(246, 248, 246);
  header {
    width: 100%;
    height: 70px;
    background: white;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    > div {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      width: 46%;
      height: 90%;
      //   border: 1px solid red;
    }
    .right {
      em {
        margin-left: 20px;
        opacity: 0.8;
        transition: all 0.5s;
        cursor: pointer;
      }
    }
  }
  main {
    width: 80%;
    height: 85vh;
    margin-top: 20px;
    margin-left: 18%;
    background: white;
    border-radius: 2px;
    > div {
      width: 100%;
      height: 100%;
      border: 0.001px solid transparent;
    }
  }
  section {
    position: fixed;
    top: 0;
    left: 0px;
    height: 100vh;
    width: 16%;
    background: white;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    img {
      width: 65px;
      height: 65px;
      margin-top: 50px;
      margin-bottom: 40px;
      border-radius: 50%;
    }
    > p {
      margin-bottom: 20px;
      width: 75%;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
      cursor: pointer;
      border-radius: 2px;

      // background: linear-gradient(90deg,rgb(181, 226, 231),rgb(221, 234, 235));

      .yumao {
        margin-right: 10px;
        font-size: 19px;
      }
      em:last-child {
        font-size: 16px;
      }
    }
  }

  .admin_index-enter-active,
  .admin_index-leave-active {
    transition: all 0.2s;
  }
  .admin_index-enter-from,
  .admin_index-leave-to {
    opacity: 0;
    transform: translateX(-3px);
    filter: blur(1px);
  }
  .click_class {
    background: rgb(131, 205, 213);
    color: white;
  }
}
</style>