<template>
  <div id="UserOther">
    <div class="left">
      <div class="add_price">
        <p class="title">
          <i class="yumao icon-qianbao"></i>
          <i>余额充值</i>
        </p>
        <div class="img">
          <p class="left">
            <img :src="pay_img" alt="" />
            <transition name="show_qr" mode="out-in">
              <i v-show="show_qr">等待生成中</i>
            </transition>
          </p>
          <p class="right">
            <i
              v-for="(v, i) in pay_list"
              :key="i"
              @click="pay(v, i)"
              :class="i == select_price ? 'selected' : ''"
              >{{ v }}</i
            >
          </p>
        </div>
        <div class="self">
          <input
            type="text"
            :placeholder="tip_text"
            v-model="self_price"
            @input="filter"
          />
          <i @click="pay(self_price)">生成</i>
        </div>
        <div class="tip">
          <p>1. 请使用使用支付宝扫码</p>
          <p>2. 可点击图片二维码刷新</p>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="top">
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
      <div class="bottom">
        <div class="left">
          <div class="info_set">
            <p class="title">
              <i class="yumao icon-wenjian"></i>
              <i>信息修改</i>
            </p>
            <div class="main">
              <div>
                <p class="tip">昵称名</p>
                <p class="inp">
                  <input type="text" v-model="user_data.name" />
                </p>
                <p class="btn"><i @click="set_name">修改</i></p>
              </div>
              <div>
                <p class="tip">用户名</p>
                <p class="inp">
                  <input type="text" v-model="user_data.user" />
                </p>
                <p class="btn"><i @click="set_user">修改</i></p>
              </div>
              <div>
                <p class="tip">邮箱名</p>
                <p class="inp">
                  <input type="text" v-model="user_data.mail" />
                </p>
                <p class="btn"><i @click="set_mail">修改</i></p>
              </div>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="msg">
            <p class="title">
              <i class="yumao icon-xiaoxi"></i>
              <i>公告信息</i>
            </p>
            <p class="main">
              {{ user_notice.content }}
            </p>
            <p class="time">
              <i>{{ user_notice.time }}</i>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { indexStore } from "~/store";
import { userStore } from "~/store/user";
import { storeToRefs } from "pinia";
import qrcode from "qrcode";
import api from "~/axios";
import user_api from "~/axios/user";
import lodash from "lodash";
let { user_data, user_token } = storeToRefs(userStore());
let { update_user } = userStore();

let { throttle } = lodash;
let tip_text = ref("自定义充值 🥵");
let select_price = ref(-1);
let self_price = ref("");
let show_qr = ref(1);
let pay_img = ref(null);
let pay_list = ref(["0.01", "0.02", "0.03", "0.04", "0.05", "0.06"]);
let timer = null;
let pass = ref({ old_pass: "", new_pass: "", again_pass: "" });
let user_notice = ref(await user_api.get_notice());
pay_img.value = await qrcode.toDataURL("https://www.gxust.edu.cn/");

let pay = throttle(async (price, index = -1, type = "btn") => {
  if (type != "btn")
    if (
      !/^([0-9]+|[0-9]{1,3}(,[0-9]{3})*)(.[0-9]{1,2})?$/.test(self_price.value)
    ) {
      alert("金额格式错误");
      return 0;
    }
  let { data } = await api.pay("pay", { price });
  let { code, qrCode, outTradeNo } = data;
  tip_text.value = "二维码生成成功！😋";
  self_price.value = "";
  select_price.value = index;
  if (code == "10000") {
    let finish = 0;
    pay_img.value = await qrcode.toDataURL(qrCode);
    show_qr.value = 0;
    timer = setInterval(async () => {
      finish = await check_finish(outTradeNo);
      if (finish) pay_success();
    }, 2500);
  } else alert("系统错误");
}, 1000);
let pay_success = async () => {
  await update_user();
  clearInterval(timer);
  show_qr.value = 1;
  select_price.value = -1;
  alert("支付成功！😋");
};
let check_finish = async (trade) => {
  let flag = 0;
  let { data } = await api.pay("add_query", { trade, token: user_token.value });
  let { code, tradeStatus } = data;
  if (code == "10000" && tradeStatus == "TRADE_SUCCESS") {
    flag = 1;
  }
  return flag;
};
let filter = () => {
  self_price.value = self_price.value.replace(/\s/g, "");
};
let set_pass = async () => {
  if (pass.value.new_pass !== pass.value.again_pass) alert("两次密码不一样 😅");
  else if (
    pass.value.new_pass.length < 6 ||
    pass.value.again_pass.length < 6 ||
    pass.value.old_pass.length < 6
  ) {
    alert("不能少于六位 🤡");
  } else {
    let { code } = await user_api.set_user_info("pass", pass.value);
    if (code == 200) {
      await update_user();
      for (let key in pass.value) pass.value[key] = "";
      alert("修改成功！🥰");
    } else alert("旧密码错误 🤡");
  }
};
let set_name = async () => {
  if (user_data.value.name)
    await user_api.set_user_info("name", { name: user_data.value.name }),
      alert("修改成功！🥰");
};
let set_user = async () => {
  if (user_data.value.user && user_data.value.user.length >= 6) {
    let { code, msg } = await user_api.set_user_info("user", {
      user: user_data.value.user,
    });
    if (code == 200) {
      alert("修改成功！🧐");
      update_user();
    } else alert("用户名已经存在！😅");
  } else alert("格式错误 🤡");
};
let set_mail = async () => {
  if (user_data.value.mail && user_data.value.mail.length >= 6) {
    let { code, msg } = await user_api.set_user_info("mail", {
      mail: user_data.value.mail,
    });
    if (code == 200) {
      alert("修改成功！🧐");
      update_user();
    } else alert("邮箱已经存在！😅");
  } else alert("格式错误 🤡");
};
</script>





<style lang="less">
#UserOther {
  display: flex;
  justify-content: space-between;

  > .left {
    width: 38%;
    height: 100%;
    .add_price {
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
        margin: 20px auto 10px auto;
        border-bottom: 2px solid rgb(252, 245, 245);
        i {
          margin-right: 8px;
        }
      }
      .img {
        display: flex;
        align-items: flex-start;
        .left {
          position: relative;
          margin-right: 20px;
          img {
            width: 200px;
            height: 200px;
          }
          i {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            width: 77.5%;
            background: gray;
            cursor: pointer;
            // height: 100%;
            // line-height: 200px;
            text-align: center;
            color: white;
          }
        }
        .right {
          margin-top: 25px;
          display: flex;
          flex-wrap: wrap;
          i {
            transition: all 0.2s;
            text-align: center;
            height: 30px;
            line-height: 30px;
            margin-bottom: 30px;
            padding: 0 30px;
            border: 1px solid rgb(243, 239, 239);
            cursor: pointer;
            border-left: 3px solid rgba(135, 206, 235, 0.4);
            border-radius: 3px;
          }
          i:nth-of-type(odd) {
            margin-right: 40px;
          }
          i.selected {
            border-left: 3px solid rgb(0, 183, 255);
          }
        }
      }
      .self {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 90%;
        height: 30px;
        margin: 0 auto;
        border: 1px solid rgb(236, 228, 228);
        border-radius: 2px;
        transition: all 0.5s;
        margin-bottom: 20px;
        input {
          width: 85%;
          font-size: 20px;
          color: rgb(75, 71, 71);
        }
        input::-webkit-input-placeholder {
          font-size: 15px;
        }
        i {
          color: rgb(99, 96, 96);
          cursor: pointer;
        }
      }
      .tip {
        font-size: 14px;
        color: rgb(95, 91, 91);
        width: 90%;
        margin: 0 auto;
        p {
          margin-bottom: 5px;
        }
      }
    }
  }
  > .right {
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
    .bottom {
      display: flex;
      justify-content: space-between;
      height: 60%;
      > div {
        background: white;
      }
      .left {
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
      .right {
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