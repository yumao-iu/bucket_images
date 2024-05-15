<template>
  <div id="components_business_other">
    <div class="left">
      <div class="top">
        <div class="left">
          <div class="msg">
            <p class="title">
              <i class="yumao icon-xiaoxi"></i>
              <i>公告信息</i>
            </p>
            <p class="main">
              {{ init_data.business_notice.content }}
            </p>
            <p class="time">
              <i>{{ init_data.business_notice.time }}</i>
            </p>
          </div>
        </div>
        <div class="right">
          <div class="info_set">
            <p class="title">
              <i class="yumao icon-wenjian"></i>
              <i>信息修改</i>
            </p>
            <div class="main">
              <div>
                <p class="tip">账号</p>
                <p class="inp">
                  <input type="text" v-model="data_business.user" />
                </p>
                <p class="btn"><i @click="set_user">修改</i></p>
              </div>
              <div>
                <p class="tip">电话</p>
                <p class="inp">
                  <input type="text" v-model="data_business.tel" />
                </p>
                <p class="btn"><i @click="set_tel">修改</i></p>
              </div>
              <div>
                <p class="tip">商家昵称</p>
                <p class="inp">
                  <input
                    type="text"
                    disabled
                    v-model="data_business.name"
                    style="cursor: not-allowed"
                  />
                </p>
                <p class="btn">
                  <i style="cursor: not-allowed">请联系管理员修改商家昵称</i>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom">
        <p class="title">
          <i class="yumao icon-beiwanglu"></i>
          <i>密码修改</i>
        </p>
        <div class="main">
          <div>
            <i>旧密码</i>
            <p>
              <input type="password" v-model="pass.old_pass" />
            </p>
          </div>
          <div>
            <i>新密码</i>
            <p>
              <input type="password" v-model="pass.new_pass" />
            </p>
          </div>
          <div>
            <i>新密码</i>
            <p>
              <input type="password" v-model="pass.again_pass" />
            </p>
          </div>
        </div>
        <div class="submit">
          <p @click="set_pass">确定修改</p>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="business_log">
        <div class="title">
          <i class="yumao icon-qianbao"></i>
          <i>操作日志</i>
        </div>
        <div class="inp">
          <p>
            <input
              type="text"
              placeholder="搜点什么吧 🥰"
              @keydown.enter="search_log"
              v-model="search_text"
            />
          </p>
          <p>
            <i @click="search_log">搜索</i><i @click="search_cancel">取消</i>
          </p>
        </div>
        <div class="log_main">
          <div class="log_title">
            <em>日志</em><em>时间</em><em>地址</em><em>设备</em>
          </div>
          <div class="log_content">
            <p class="log_1" v-for="(v, i) in log_data" :key="i">
              <em :title="v.content">{{ v.content }}</em
              ><em :title="v.time">{{ v.time }}</em
              ><em :title="v.ip">{{ v.ip }}</em
              ><em :title="v.device">{{ v.device }}</em>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
  
<script setup>
import { indexStore } from "~/store";
import { businessStore } from "~/store/business";
import { storeToRefs } from "pinia";
import business_api from "~/axios/business";
let { init_data } = storeToRefs(indexStore());
let { data_business } = storeToRefs(businessStore());
let log_data = ref(await business_api.get_log());
let pass = ref({ old_pass: "", new_pass: "", again_pass: "" });
let search_text = ref("");
let set_user = async () => {
  if (data_business.value.user.length >= 6) {
    let { code } = await business_api.set_user(data_business.value.user);
    if (code == 200) {
      alert("修改成功！🧐");
      // update_user();
    } else alert("用户名已经存在！😅");
  } else alert("格式错误 🤡");
};
let set_tel = async () => {
  if (data_business.value.tel.length == 11) {
    let { code } = await business_api.set_tel(data_business.value.tel);
    if (code == 200) alert("修改成功！🧐");
    // update_user();
  } else alert("请填写十一位电话号码 🤡");
};
let set_pass = async () => {
  if (pass.value.new_pass !== pass.value.again_pass) alert("两次密码不一样 😅");
  else if (
    pass.value.new_pass.length < 6 ||
    pass.value.again_pass.length < 6 ||
    pass.value.old_pass.length < 6
  )
    alert("不能少于六位 🤡");
  else {
    let { code } = await business_api.set_pass(pass.value);
    if (code == 200) {
      // await update_user();
      for (let key in pass.value) pass.value[key] = "";
      alert("修改成功！🥰");
    } else alert("旧密码错误 🤡");
  }
};

let search_log = async () => {
  let search_data = await business_api.search_log(search_text.value);
  if (search_data.length) {
    log_data.value = await business_api.search_log(search_text.value);
  } else alert("无数据 😀");
};
let search_cancel = async () => {
  log_data.value = await business_api.get_log();
  search_text.value = "";
};
</script>
  
  
  
  
  
  <style lang="less">
#components_business_other {
  display: flex;
  justify-content: space-between;
  > .left {
    height: 100%;
    width: 60%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    > div {
      width: 100%;
      border-radius: 2px;
    }
    .top {
      display: flex;
      justify-content: space-between;
      height: 60%;
      > div {
        background: white;
      }
      .left {
        width: 56%;
        .msg {
          .title {
            display: flex;
            align-items: center;
            font-size: 20px;
            width: 82%;
            height: 30px;
            margin: 20px auto 15px auto;
            border-bottom: 2px solid rgb(252, 245, 245);
            i {
              margin-right: 8px;
            }
          }
          .main {
            width: 80%;
            height: 120px;
            margin: 0 auto;
            margin-bottom: 25px;
            color: rgb(56, 51, 51);
            line-height: 25px;

            display: -webkit-box;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-line-clamp: 5;
          }
          .time {
            display: flex;
            width: 80%;
            margin: 0 auto;
            justify-content: flex-end;
            color: rgb(48, 45, 45);
          }
        }
      }
      .right {
        width: 40%;
        .info_set {
          .title {
            display: flex;
            align-items: center;
            font-size: 20px;
            width: 74.5%;
            height: 30px;
            margin: 20px auto 10px auto;
            border-bottom: 2px solid rgb(252, 245, 245);
            i {
              margin-right: 8px;
            }
          }
          .main {
            > div {
              margin: 0 auto 16px auto;
              width: 75%;
              input {
                font-size: 16px !important;
              }
              .tip {
                margin-bottom: 3px;
                font-size: 14px;
                color: rgb(29, 28, 28);
              }
              .inp {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 24px;
                border: 1px solid rgb(235, 237, 237);
                margin-bottom: 6px;
                input {
                  font-size: 17px;
                  width: 90%;
                  color: rgb(35, 34, 34);
                }
              }
              .btn {
                font-size: 13px;
                i {
                  transition: all 0.5s;
                  cursor: pointer;
                  color: rgb(29, 28, 28);
                  &:hover {
                    color: rgb(106, 159, 232);
                  }
                }
              }
            }
          }
        }
      }
    }
    .bottom {
      height: 36%;
      background: white;
      .title {
        font-size: 20px;
        display: flex;
        align-items: center;
        width: 90%;
        height: 30px;
        margin: 20px auto 10px auto;
        border-bottom: 2px solid rgb(252, 245, 245);
        i {
          margin-right: 8px;
        }
      }
      .main {
        width: 90%;
        margin: 0 auto 20px auto;
        display: flex;
        > div {
          width: 40%;
          display: flex;
          flex-direction: column;
          i {
            font-size: 13px;
            margin-bottom: 5px;
          }
          p {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 30px;
            width: 90%;
            border: 1px solid rgb(235, 237, 237);
            box-shadow: 0 0 0 1px transparent;
            border-radius: 1px;
            transition: all 0.5s;
            &:hover {
              box-shadow: 0 0 0 0.8px rgba(2, 180, 250, 0.2);
            }
            input {
              font-size: 17px;
              width: 90%;
              color: rgb(35, 34, 34);
            }
          }
        }
      }
      .submit {
        margin: 0 auto;
        width: 84%;
        display: flex;
        justify-content: flex-end;
        p {
          cursor: pointer;
          font-size: 14px;
          transition: all 0.5s;
          opacity: 0.9;
          background: linear-gradient(
            45deg,
            rgba(70, 185, 197, 1),
            rgba(70, 185, 197, 0.7)
          );
          color: white;
          padding: 5px 12px;
          border-radius: 2px;
          &:hover {
            opacity: 1;
          }
        }
      }
    }
  }
  > .right {
    display: flex;
    flex-direction: column;
    width: 38%;
    height: 100%;
    .business_log {
      width: 100%;
      height: 100%;
      background: white;
      border-radius: 2px;
      border: 0.0001px solid transparent;
      .title {
        display: flex;
        align-items: center;
        font-size: 20px;
        width: 90%;
        height: 30px;
        margin: 20px auto 25px auto;
        border-bottom: 2px solid rgb(252, 245, 245);
        i {
          margin-right: 8px;
        }
      }
      .inp {
        width: 90%;
        margin: 0 auto 22px auto;
        display: flex;
        height: 30px;
        p {
          display: flex;
          justify-content: center;
          align-items: center;
          border-bottom: 1px solid rgb(244, 240, 240);
          input {
            font-size: 18px;
            padding: 0 20px;
          }
        }
        p:nth-of-type(1) {
          width: 45%;
        }
        p:nth-of-type(2) {
          display: flex;
          i {
            color: rgb(177, 171, 171);
            margin: 0 10px;
            cursor: pointer;
            transition: all 0.5s;
          }
          i:hover {
            color: rgb(104, 140, 237);
          }
        }
      }
      .log_main {
        width: 90%;
        margin: 0 auto;
        .log_title {
          display: flex;
          margin-bottom: 10px;
          height: 25px;
          border-bottom: 1px solid rgb(245, 241, 241);
          em {
            margin: 0 10px;
            width: 25%;
          }
          em:nth-of-type(1) {
            width: 16%;
          }
        }
        .log_content {
          font-size: 15px;
          height: 300px;
          overflow: auto;
          p {
            display: flex;
            margin-bottom: 10px;
            em {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              width: 25%;
              margin: 0 10px;
            }
            em:nth-of-type(1) {
              width: 16%;
            }
          }
        }
      }
    }
  }

  .show_qr-enter-active,
  .show_qr-leave-active {
    transition: all 0.2s;
  }
  .show_qr-enter-from,
  .show_qr-leave-to {
    opacity: 0;
    filter: blur(1px);
  }
}
</style>