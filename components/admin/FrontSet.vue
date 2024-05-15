
<template>
  <div id="FrontSet">
    <div class="title">
      <p
        v-for="(v, i) in section_obj"
        :key="i"
        @click="set_index(i)"
        :class="section_index == i ? 'selected_class' : ''"
      >
        {{ v }}
      </p>
    </div>
    <Transition name="fron_food" mode="out-in">
      <div class="swiper_content" v-if="section_index == 0">
        <p class="set_swiper" @click="upload_btn">更新轮播</p>
        <p class="show_swiper">
          <img v-for="(v, i) in swiper" :key="i" :src="'/images/' + v.img" />
        </p>
        <div v-show="files.length">
          <p style="margin-bottom: 15px">替换成:</p>
          <p class="show_swiper">
            <img v-for="(v, i) in show_swiper" :key="i" :src="v.img" />
          </p>
        </div>
        <p @click="sure_swiper">更新</p>
      </div>
      <div class="update_news" v-else-if="section_index == 1">
        <p class="add_news">添加新闻</p>
        <div class="show_news">
          <div class="new_1" v-for="v in news" :key="v">
            <p class="title">
              <i class="yumao icon-xinxi"></i
              ><input type="text" v-model="v.title" />
            </p>
            <p class="link">
              <i class="yumao icon-lianjie"></i
              ><input type="text" v-model="v.link" />
            </p>
            <p class="fn">
              <!-- <i class="yumao icon-shang"></i>
              <i class="yumao icon-xia"></i> -->
              <!-- <i class="yumao icon-dacha"></i> -->
            </p>
          </div>
        </div>
        <p @click="sure_news">保存</p>
      </div>
      <div class="show_food" v-else-if="section_index == 2">
        <p>菜品展示</p>
        <div>
          <input type="text" v-model="foodStr" @input="filter_other" />
          <!-- <i class="yumao icon-cross"></i> -->
        </div>
        <p @click="sure_food">保存</p>
      </div>
      <div class="other_set" v-else-if="section_index == 3">
        <p class="add_news">其他信息</p>
        <div class="show_news">
          <div class="new_1" v-for="v in detail" :key="v">
            <p class="title">
              <i class="yumao icon-xinxi"></i
              ><input type="text" v-model="v.content" />
            </p>
            <p class="fn">
              <!-- <i class="yumao icon-shang"></i>
              <i class="yumao icon-xia"></i>
              <i class="yumao icon-dacha"></i> -->
            </p>
          </div>
        </div>
        <p @click="sure_other">保存</p>
      </div>
      <div class="notice_set" v-else-if="section_index == 4">
        <div class="user_notice">
          <p>用户公告</p>
          <div class="content">
            <textarea v-model="user_notice.content"></textarea>
          </div>
          <p @click="sure_notice('user')">保存</p>
        </div>
        <div class="business_notice">
          <p>商家公告</p>
          <div class="content">
            <textarea v-model="business_notice.content"></textarea>
          </div>
          <p @click="sure_notice('business')">保存</p>
        </div>
      </div>
    </Transition>
    <input
      type="file"
      @change="file_change"
      multiple
      accept="image/*"
      style="display: none"
    />
  </div>
</template>

<script  setup>
import { indexStore } from "~/store";
import { adminStore } from "~/store/admin";
import { storeToRefs } from "pinia";
import _ from "lodash";
import api from "~/axios/admin";

let { init_data } = storeToRefs(indexStore());
let section_index = ref(0);
let section_obj = ref([
  "轮播展示",
  "新闻设置",
  "菜品展示",
  "其他信息",
  "公告设置",
]);

let swiper = ref(init_data.value.swiper);
let news = ref(init_data.value.news);
let food = reactive(init_data.value.food);
let show_swiper = reactive([]);
let foodStr = ref("");
let detail = reactive(init_data.value.detail);
let user_notice = ref(init_data.value.user_notice);
let business_notice = ref(init_data.value.business_notice);

let files = reactive({});
food.map((v, i) => {
  foodStr.value += v.id + ",";
  if (i == food.length - 1) foodStr.value = foodStr.value.replace(/,$/, "");
});

let set_index = (i) => {
  files = {};
  section_index.value = i;
};
let upload_btn = () => {
  document.querySelector("input[type=file]").click();
};
let file_change = (e) => {
  files = e.target.files;
  let length = files.length;
  if (length) {
    show_swiper.splice(0);
    for (let i = 0; i < length; i++) {
      let reader = new FileReader();
      reader.readAsDataURL(files[i]);
      reader.addEventListener("load", () => {
        show_swiper.push({ img: reader.result });
      });
    }
  }
};
let sure_swiper = async () => {
  if (!files.length) return;
  let formData = new FormData();
  for (let i = 0; i < files.length; i++) formData.append("files", files[i]);
  await api.set_swiper(formData);
  location.href = location.href;
};
let sure_news = async () => {
  for (let i = 0; i < news.value.length; i++) await api.set_news(news.value[i]);
};
let sure_food = async () => {
  foodStr.value = foodStr.value.replace(/,$/, "");
  foodStr.value = foodStr.value.replace(/,,/, ",");
  await api.set_food_show(foodStr.value);
};
let sure_other = async () => {
  for (let i = 0; i < detail.length; i++) await api.set_other(detail[i]);
};
let sure_notice = async (who) => {
  if (who == "user") await api.set_user_notice(who, user_notice.value.content);
  else await api.set_user_notice(who, business_notice.value.content);
  alert("修改成功！😅");
};
let filter_other = () => {
  foodStr.value = foodStr.value.replace(/，|\|/g, ",");
};
</script>

<style lang="less">
#FrontSet {
  > .title {
    width: 95%;
    height: 60px;
    border-bottom: 1px solid rgba(210, 199, 199, 0.4);
    margin: 10px auto 10px auto;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 30px;
    p {
      text-align: center;
      margin: 0 10px;
      cursor: pointer;
      padding: 10px 15px;
      transition: all 0.5s;
      background: white;
      color: rgb(113, 110, 126);
      border-bottom: 2px solid transparent;
    }
    .selected_class {
      border-bottom: 2px solid rgb(131, 205, 213);
    }
  }
  .swiper_content {
    width: 45%;
    // margin: 0 auto;
    margin-left: 30px;
    display: flex;
    flex-direction: column;
    // border: 1px solid gray;
    .set_swiper {
      text-align: center;
      width: 90px;
      padding: 7px 3px;
      box-shadow: 0 0 1px 2px rgba(67, 185, 197, 0.1);
      margin-bottom: 20px;
      cursor: pointer;
      border-radius: 1.5px;
      color: white;
      background: linear-gradient(50deg, rgb(67, 185, 197), rgb(158, 214, 220));
    }
    .show_swiper {
      display: flex;
      flex-wrap: wrap;
      img {
        border-radius: 2px;
        height: 100px;
        width: 200px;
        margin-right: 20px;
        margin-bottom: 20px;
      }
    }
    > p:last-child {
      text-align: center;
      width: 60px;
      padding: 7px 3px;
      box-shadow: 0 0 1px 2px rgba(67, 185, 197, 0.1);
      margin-bottom: 20px;
      cursor: pointer;
      border-radius: 1.5px;
      color: white;
      background: linear-gradient(50deg, rgb(67, 185, 197), rgb(158, 214, 220));
    }
  }
  .update_news {
    width: 95%;
    height: 80%;
    margin: 0 auto;
    .add_news,
    > p {
      text-align: center;
      width: 90px;
      padding: 7px 3px;
      box-shadow: 0 0 1px 2px rgba(67, 185, 197, 0.1);
      margin-bottom: 20px;
      cursor: pointer;
      border-radius: 1.5px;
      color: white;
      background: linear-gradient(50deg, rgb(67, 185, 197), rgb(158, 214, 220));
    }
    > p:last-child {
      width: 60px;
    }
    .show_news {
      width: 100%;
      // overflow: auto;
      // height: 90%;
      div[class^="new"] {
        width: 90%;
        margin-bottom: 20px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .title,
        .link {
          display: flex;
          align-items: center;
          margin-right: 20px;
          .yumao {
            width: 30px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            background: white;
            border: 1px solid rgb(225, 221, 221);
          }
          input {
            padding: 5px 8px;
            height: 31px;
            width: 250px;
            font-size: 13px;
            border: 1px solid rgb(225, 221, 221);
            border-left: none;
            color: rgb(67, 66, 66);
          }
        }

        .fn {
          display: flex;
          align-items: center;
          i {
            width: 30px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            margin-right: 14px;
            cursor: pointer;
            font-size: 13px;
            border: 1px solid rgb(234, 228, 228);
          }
          .icon-dacha {
            font-weight: bold;
          }
        }
      }
    }
  }
  .other_set {
    width: 95%;
    height: 80%;
    margin: 0 auto;
    > p {
      text-align: center;
      width: 90px;
      padding: 7px 3px;
      box-shadow: 0 0 1px 2px rgba(67, 185, 197, 0.1);
      margin-bottom: 20px;
      cursor: pointer;
      border-radius: 1.5px;
      color: white;
      background: linear-gradient(50deg, rgb(67, 185, 197), rgb(158, 214, 220));
    }
    > p:last-child {
      width: 60px;
    }
    .show_news {
      width: 100%;
      // overflow: auto;
      // height: 90%;
      div[class^="new"] {
        width: 90%;
        margin-bottom: 20px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .title {
          display: flex;
          align-items: center;
          margin-right: 20px;
          .yumao {
            width: 30px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            background: white;
            border: 1px solid rgb(225, 221, 221);
          }
          input {
            padding: 5px 8px;
            height: 31px;
            width: 250px;
            font-size: 13px;
            border: 1px solid rgb(225, 221, 221);
            border-left: none;
            color: rgb(67, 66, 66);
          }
        }

        .fn {
          display: flex;
          align-items: center;
          i {
            width: 30px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            margin-right: 14px;
            cursor: pointer;
            font-size: 13px;
            border: 1px solid rgb(234, 228, 228);
          }
          .icon-dacha {
            font-weight: bold;
          }
        }
      }
    }
  }

  .show_food {
    width: 95%;
    height: 80%;
    margin: 0 auto;
    > p {
      text-align: center;
      width: 90px;
      padding: 7px 3px;
      box-shadow: 0 0 1px 2px rgba(67, 185, 197, 0.1);
      margin-bottom: 20px;
      cursor: pointer;
      border-radius: 1.5px;
      color: white;
      background: linear-gradient(50deg, rgb(67, 185, 197), rgb(158, 214, 220));
    }
    > p:last-child {
      width: 60px;
    }
    > div {
      display: flex;
      align-items: center;
      width: 580px;
      height: 35px;
      border: 1px solid rgb(225, 222, 222);
      border-radius: 4px;
      transition: all 0.5s;
      box-shadow: 0 0 1px 2px transparent;
      margin-bottom: 20px;
      &:hover {
        box-shadow: 0 0 1px 1px rgb(220, 238, 245);
      }
      input {
        margin-left: 15px;
        margin-right: 15px;
        width: 90%;
        font-size: 19px;
      }
      .yumao {
        color: rgb(74, 73, 73);
        cursor: pointer;
      }
    }
  }
  .notice_set {
    width: 95%;
    height: 80%;
    // border: 1px solid gray;
    margin: 0 auto;
    display: flex;
    > div {
      margin-right: 80px;
    }
    p {
      text-align: center;
      width: 90px;
      padding: 7px 3px;
      box-shadow: 0 0 1px 2px rgba(67, 185, 197, 0.1);
      margin-bottom: 20px;
      cursor: pointer;
      border-radius: 1.5px;
      color: white;
      background: linear-gradient(50deg, rgb(67, 185, 197), rgb(158, 214, 220));
    }
    textarea {
      resize: none;
      width: 350px;
      height: 300px;
      border: 1px solid rgb(239, 233, 233);
      padding: 12px 10px;
      font-size: 18px;
      margin-bottom: 10px;
    }
  }
}
.fron_food-enter-active,
.fron_food-leave-active {
  transition: all 0.2s;
}
.fron_food-enter-from,
.fron_food-leave-to {
  opacity: 0;
  transform: translateX(-3px);
  filter: blur(1px);
}
</style>