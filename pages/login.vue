<template>
  <div id="pages_login">
    <section>
      <div class="left">
        <img src="/images/xiaomen.jpg" />
      </div>
      <div class="right">
        <p class="title">{{ who_title }}</p>
        <div class="username">
          <p>账号</p>
          <div>
            <i class="yumao icon-icon_line_user-30"></i>
            <p>
              <input
                type="text"
                placeholder="用户名"
                maxlength="15"
                size="15"
                v-model="account.user"
                @input="filter_white"
              />
            </p>
            <i></i>
          </div>
        </div>
        <Transition name="mail_transition" mode="out-in">
          <KeepAlive>
            <div class="email" v-show="current_function == 2">
              <p>邮箱</p>
              <div>
                <i class="yumao icon-icon_line_baodan"></i>
                <p>
                  <input
                    type="text"
                    placeholder="邮箱"
                    maxlength="15"
                    size="15"
                    v-model="account.mail"
                    @input="filter_white"
                  />
                </p>
                <i></i>
              </div>
            </div>
          </KeepAlive>
        </Transition>

        <div class="password">
          <p>密码</p>
          <div>
            <i class="yumao icon-icon_line_safe"></i>
            <p>
              <input
                :type="inp_type"
                placeholder="密码"
                maxlength="15"
                size="15"
                v-model="account.pass"
                @input="filter_white"
                @keyup.enter="send"
              />
            </p>
            <i :class="'yumao ' + show_pass" @click="set_eye" id="show_eye"></i>
          </div>
        </div>
        <div class="other">
          <em @click="select_fn(1,'用户登录')">用户登录</em>
          <em @click="select_fn(2,'用户注册')">用户注册</em>
          <em @click="select_fn(3,'管理员登录')">管理员登录</em>
          <em @click="select_fn(5,'商家登录')">商家登录</em>
          <em @click="select_fn(4,'用户找回密码')">用户找回密码</em>
        </div>
        <p class="login_btn" @click="send">确 定</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { userStore } from "~/store/user";
import { adminStore } from "~/store/admin";
import { businessStore } from "~/store/business";
import { storeToRefs } from "pinia";
import _ from "lodash";
import api from "~/axios";

let { admin_token, admin_data } = storeToRefs(adminStore());
let { user_token, user_data } = storeToRefs(userStore());
let { data_business, token_business } = storeToRefs(businessStore());

let router = useRouter();
let current_function = ref(1);
let who_title = ref("用户登录");
let inp_type = ref("password");
let show_pass = ref("icon-icon_line_eye");
let account = ref({ user: "", pass: "", mail: "" });

let select_fn = (index,title) => {
  for (let key in account.value) account.value[key] = "";
  current_function.value = index;
  who_title.value = title;
};
let set_eye = () => {
  if (show_pass.value == "icon-icon_line_eye") {
    show_pass.value = "icon-yincang";
    inp_type.value = "text";
  } else {
    show_pass.value = "icon-icon_line_eye";
    inp_type.value = "password";
  }
};
let send = async () => {
  if (current_function.value == 3) {
    //管理员登录
    let data = await api.admin_login(account.value);
    if (data.code) {
      admin_token.value = data.token;
      admin_data.value = data.data;
      localStorage.setItem("admin_token", data.token);
      router.push({ path: "/admin" });
    } else alert("账号或者密码错误！🤡");
  } else if (current_function.value == 1) {
    //用户登录
    let { token, data, code } = await api.user_login(account.value);
    if (code) {
      user_token.value = token;
      user_data.value = data;
      localStorage.setItem("user_token", token);
      router.push({ path: "/user" });
    } else alert("账号或者密码错误！🤡");
  } else if (current_function.value == 2) {
    //用户注册
    if (
      account.value.user.length < 6 ||
      account.value.pass.length < 6 ||
      account.value.mail.length < 6
    ) {
      alert("至少六位数 🤡");
      return 0;
    }
    if (
      !/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,6})$/.test(
        account.value.mail
      )
    ) {
      alert("邮箱格式好像不对 🤡");
      return 0;
    }
    let { code, token, data } = await api.user_reg(account.value);
    if (code == 0) {
      user_token.value = token;
      user_data.value = data;
      localStorage.setItem("user_token", token);
      location.href = "/user";
    } else if (code == -1) alert("用户名已存在");
    else if (code == -2) alert("邮箱已存在");
  } else if (current_function.value == 4) {
    //用户找回
    let { code } = await api.user_find(account.value);
    if (code) {
      alert("邮箱已经发送！");
      for (let key in account.value) account.value[key] = "";
    } else alert("用户名或者邮箱不存在！");
  } else if (current_function.value == 5) {
    //商家登录
    let { data, token, code } = await api.business_login(account.value);
    if (code) {
      data_business.value = data;
      token_business.value = token;
      router.push({ path: "/business" });
    } else alert("账号或密码错误🤡");
  }
};
let filter_white = () => {
  for (let key in account.value)
    account.value[key] = account.value[key].replace(/\s+/g, "");
};
</script>

<style lang="less">
#pages_login {
  section {
    width: 90%;
    max-width: 1420px;
    margin: 0 auto;
    margin-top: 100px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    .left {
      width: 58%;
      img {
        filter: blur(0.2px);
        border-radius: 3px;
        width: 100%;
      }
    }
    .right {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 40%;
      box-shadow: 0 0 1px 3px rgba(241, 238, 238, 0.4);
      > .title {
        margin-top: 30px;
        color: rgb(36, 34, 34);
        font-size: 20px;
        margin-bottom: 20px;
      }
      > div {
        width: 80%;
        .yumao {
          color: rgb(130, 126, 126);
        }
      }
      .username {
        margin-bottom: 30px;
        > p {
          margin-bottom: 8px;
          color: rgb(92, 90, 90);
        }
        > div {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          border: 1px solid rgba(148, 134, 134, 0.1);
          border-radius: 2px;
          transition: all 0.5s;
          &:hover {
            border: 1px solid rgba(148, 134, 134, 0.3);
          }
          i {
            line-height: 40px;
            width: 30px;
            text-align: center;
            font-size: 20px;
          }
          p {
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 2px;
            width: 80%;
            input {
              &:focus {
                transform: translateX(2px);
              }
              color: rgb(77, 74, 74);
              transition: all 0.2s;
              width: 90%;
              height: 40px;
              font-size: 20px;
            }
            input::-webkit-input-placeholder {
              transform: translate(6px, 0);
              font-size: 16px;
            }
          }
        }
      }
      .password {
        margin-bottom: 16px;
        > p {
          margin-bottom: 8px;
          color: rgb(92, 90, 90);
        }
        > div {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          border: 1px solid rgba(148, 134, 134, 0.1);
          border-radius: 2px;
          transition: all 0.5s;
          &:hover {
            border: 1px solid rgba(148, 134, 134, 0.3);
          }
          i {
            line-height: 40px;
            width: 30px;
            text-align: center;
            font-size: 20px;

            &:nth-last-of-type(1) {
              cursor: pointer;
            }
          }
          p {
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 2px;
            width: 80%;
            input {
              &:focus {
                transform: translateX(2px);
              }
              transition: all 0.2s;
              width: 90%;
              height: 40px;
              font-size: 20px;
            }
            input::-webkit-input-placeholder {
              transform: translate(6px, 0);
              font-size: 16px;
            }
          }
        }
      }
      .email {
        margin-bottom: 30px;
        > p {
          margin-bottom: 8px;
          color: rgb(92, 90, 90);
        }
        > div {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          border: 1px solid rgba(148, 134, 134, 0.1);
          border-radius: 2px;
          transition: all 0.5s;
          &:hover {
            border: 1px solid rgba(148, 134, 134, 0.3);
          }
          i {
            line-height: 40px;
            width: 30px;
            text-align: center;
            font-size: 20px;
          }
          p {
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 2px;
            width: 80%;
            input {
              &:focus {
                transform: translateX(2px);
              }
              transition: all 0.2s;
              width: 90%;
              height: 40px;
              font-size: 20px;
            }
            input::-webkit-input-placeholder {
              transform: translate(6px, 0);
              font-size: 16px;
            }
          }
        }
      }
      .other {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 28px;
        em {
          font-size: 14px;
          margin-left: 15px;
          color: gray;
          //   cursor: not-allowed;
          cursor: pointer;
        }
      }
      .login_btn {
        cursor: pointer;
        height: 33px;
        line-height: 33px;
        text-align: center;
        width: 80%;
        font-size: 17px;
        color: white;
        background: rgb(59, 182, 193);
        border-radius: 3px;
        margin-bottom: 10px;
        opacity: 0.9;
        transition: all 0.5s;
        &:hover {
          opacity: 1;
        }
      }
    }
  }
  .mail_transition-enter-active,
  .mail_transition-leave-active {
    transition: all 0.2s;
  }
  .mail_transition-enter-from,
  .mail_transition-leave-to {
    opacity: 0;
    filter: blur(1px);
  }
}
</style>