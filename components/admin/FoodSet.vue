
<template>
  <div id="FoodSet">
    <div class="title">
      <div class="left">
        <p>
          <input
            type="text"
            placeholder="搜点什么吧😋"
            v-model="search_text"
            maxlength="19"
            @keydown.enter="search_food"
            @input="filter_s"
          />
          <i class="yumao icon-sousuo" @click="search_food"></i>
          <i class="yumao icon-dacha" @click="search_cancel"></i>
        </p>
      </div>
      <div class="right">
        <p class="add_food" @click="add_mask = 1">添加</p>
      </div>
    </div>
    <div class="content">
      <div class="header">
        <p><em></em><em>编号</em></p>
        <p><em></em><em>名称</em></p>
        <p><em></em><em>供应</em></p>
        <p><em></em><em>食材</em></p>
        <p><em></em><em>操作</em></p>
      </div>
      <div class="main">
        <div :id="'food_' + v.id" v-for="v in data" :key="v">
          <p>
            <em>{{ v.id }}</em>
          </p>
          <p>
            <em>{{ v.name }}</em>
          </p>
          <p>
            <em>{{ v.localtion }}</em>
          </p>
          <p>
            <em>{{ v.introduce }}</em>
          </p>
          <p class="fn_btn">
            <em class="other_btn" @click="more_food(v)"><i>编辑</i></em>
          </p>
        </div>
      </div>
    </div>
    <Transition name="show_mask" mode="out-in">
      <!--编辑 -->
      <div id="show_mask" v-show="show_mask">
        <div class="back" @click="show_mask = 0"></div>
        <div class="content">
          <div class="img">
            <img
              :src="'/images/' + show_more.img"
              @click="click_img_show"
              class="img_dom_01"
            />
            <input
              type="file"
              style="display: none"
              @change="show_file_change"
              id="show_file_change"
            />
          </div>
          <div class="double_item">
            <div class="first_item">
              <p>编号</p>
              <p>
                <input
                  type="text"
                  disabled
                  v-model="show_more.id"
                  style="cursor: not-allowed"
                />
              </p>
            </div>
            <div class="first_item">
              <p>名称</p>
              <p>
                <input type="text" v-model="show_more.name" />
              </p>
            </div>
          </div>
          <div class="double_item">
            <div class="first_item">
              <p>价格</p>
              <p>
                <input type="text" v-model="show_more.price" />
              </p>
            </div>
            <div class="first_item">
              <p>商家</p>
              <p>
                <input type="text" v-model="show_more.localtion" />
              </p>
            </div>
          </div>
          <div class="item">
            <p>原料</p>
            <p>
              <input type="text" v-model="show_more.detail" />
            </p>
          </div>
          <div class="item">
            <p>介绍</p>
            <p>
              <input type="text" v-model="show_more.introduce" />
            </p>
          </div>
          <div>
            <p class="delete_btn" @click="delete_food">删除</p>
            <p class="save_btn" @click="save_food">保存</p>
          </div>
        </div>
      </div>
    </Transition>
    
    <Transition name="add_mask" mode="out-in">
      <!-- 添加 -->
      <div id="add_mask" v-show="add_mask">
        <div class="back" @click="add_mask = 0"></div>
        <div class="content">
          <div class="img">
            <img src="/favicon.ico" @click="click_img_02" class="img_dom_02" />
            <input
              type="file"
              style="display: none"
              @change="click_change_02"
              id="files_02"
            />
          </div>
          <div class="double_item">
            <div class="first_item">
              <p>名称</p>
              <p>
                <input type="text" v-model="add_food_data.name" />
              </p>
            </div>
            <div class="first_item">
              <p>价格</p>
              <p>
                <input type="text" v-model="add_food_data.price" />
              </p>
            </div>
          </div>
          <div class="double_item">
            <div class="first_item">
              <p>商家</p>
              <p>
                <input type="text" v-model="add_food_data.localtion" />
              </p>
            </div>
            <div class="first_item">
              <p>原料</p>
              <p>
                <input type="text" v-model="add_food_data.detail" />
              </p>
            </div>
          </div>

          <div class="item">
            <p>介绍</p>
            <p>
              <input type="text" v-model="add_food_data.introduce" />
            </p>
          </div>
          <div>
            <p class="add_btn" @click="sure_add_food">添加</p>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import _ from "lodash";
import api from "~/axios/admin";

let data = ref(await api.get_food());
let show_mask = ref(0);
let add_mask = ref(0);
let search_text = ref("");
let files_01 = ref([]); //编辑
let files_02 = ref([]); //添加
let search_data = reactive([]);
let show_more = reactive({});
let add_food_data = ref({
  img: "",
  name: "",
  price: "",
  detail: "",
  introduce: "",
});

let search_food = async () => {
  search_data = await api.search_food(search_text.value);
  if (search_data.length) data.value = search_data;
  else alert("搜索无结果 🤡");
};
let search_cancel = async () => {
  search_data = await api.search_food("");
  data.value = search_data;
  search_text.value = "";
};
let filter_s = async () => {
  search_text.value = search_text.value.replace(/\s+/g, "");
};
let more_food = async (v) => {
  show_mask.value = 1;
  show_more = v;
};
let click_img_show = async () => {
  document.querySelector("#show_file_change").click();
};
let show_file_change = async (e) => {
  files_01.value = e.target.files;
  if (!files_01.value.length) return;
  document.querySelector(".img_dom_01").src = URL.createObjectURL(
    files_01.value[0]
  );
};
let save_food = async () => {
  let form_data = new FormData();
  if (files_01.value.length) form_data.append("files", files_01.value[0]);
  form_data.append("data", JSON.stringify(show_more));
  await api.save_food(form_data);
  show_mask.value = 0;
};
let delete_food = async () => {
  if (confirm("确定删除?")) {
    await api.delete_food(show_more);
    alert("删除成功！");
    show_mask.value = 0;
    data.value = data.value.filter((v) => v.id != show_more.id);
  }
};
let click_img_02 = async () => {
  document.querySelector("#files_02").click();
};
let click_change_02 = async (e) => {
  files_02 = e.target.files;
  if (!files_02.length) return;
  document.querySelector(".img_dom_02").src = URL.createObjectURL(files_02[0]);
};
let sure_add_food = async () => {
  let form_data = new FormData();
  for (let i = 0; i < files_02.length; i++)
    form_data.append("files", files_02[i]);
  form_data.append("data", JSON.stringify(add_food_data.value));
  api.add_food(form_data);
  alert("添加成功");
  add_mask.value = 0;
};
</script>


  <style lang="less">
#FoodSet {
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
      > div[id^="food_"] {
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
      .double_item {
        display: flex;
        width: 80%;
        justify-content: space-between;
        margin-bottom: 18px;
        > div {
          width: 48%;
          > p:first-child {
            font-size: 14px;
            margin-bottom: 6px;
          }
          > p:last-child {
            display: flex;
            align-items: center;
            height: 25px;
            border: 1px solid rgb(222, 221, 221);
          }
          input {
            width: 80%;
            font-size: 20px;
            border-radius: 1px;
            margin-left: 5px;
            font-size: 16px;
          }
        }
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
      .double_item {
        display: flex;
        width: 80%;
        justify-content: space-between;
        margin-bottom: 18px;
        > div {
          width: 48%;
          > p:first-child {
            font-size: 14px;
            margin-bottom: 6px;
          }
          > p:last-child {
            display: flex;
            align-items: center;
            height: 25px;
            border: 1px solid rgb(222, 221, 221);
          }
          input {
            width: 80%;
            font-size: 20px;
            border-radius: 1px;
            margin-left: 5px;
            font-size: 16px;
          }
        }
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