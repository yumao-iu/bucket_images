import axios from 'axios';
import { adminStore } from '~/store/admin'



let admin_axios = axios.create({
    method: 'post',
    // baseURL:'https://hl.sb:2000/api/v1/admin',
    baseURL: 'http://127.0.0.1:1000/api/v1/admin',
})
admin_axios.interceptors.request.use((config) => {
    let { admin_token } = adminStore()
    config.headers.Authorization = admin_token
    return config;
}, (err) => { console.log(err); })

export default {
    async set_swiper(formdata) {
        let data = await admin_axios({
            url: '/set_swiper',
            data: formdata
        })
        return data;
    },
    async set_news(news) {
        let data = await admin_axios({
            url: '/set_news',
            data: news
        })
        return data;
    },
    async set_other(detail) {
        let data = await admin_axios({
            url: '/set_other',
            data: detail
        })
        return data;
    },
    async get_staff() {
        let { data } = await admin_axios({
            url: '/get_staff',
        })
        return data;
    },
    async get_user() {
        let { data } = await admin_axios({
            url: '/get_user',
        })
        return data;
    },
    async get_food() {
        let { data } = await admin_axios({
            url: '/get_food',
        })
        return data;
    },
    async get_all_trade() {
        let { data } = await admin_axios({
            url: '/get_all_trade',
        })
        if (data.length) {
            data.forEach((v) => {
                if (v.estimate == "-1") v.estimate_tip = "用户删除";
                else if (v.estimate == "1") v.estimate_tip = "正常评论";
                else if (v.estimate == "-2") v.estimate_tip = "管理删除";
            });
        }
        return data;
    },
    async set_account(info) {
        let data = await admin_axios({
            url: '/set_account',
            data: info
        })
        return data;
    },
    async set_food_show(food_str) {
        let data = await admin_axios({
            url: '/set_food_show',
            data: { food_str }
        })
        return data;
    },
    async search_food(text) {
        let { data } = await admin_axios({
            url: '/search_food',
            data: { text }
        })
        return data;
    },
    async search_staff(text) {
        let { data } = await admin_axios({
            url: '/search_staff',
            data: { text }
        })
        return data;
    },
    async search_user(text) {
        let { data } = await admin_axios({
            url: '/search_user',
            data: { text }
        })
        return data;
    },
    async save_food(v) {
        let { data } = await admin_axios({
            url: '/save_food',
            data: v
        })
        return data;
    },
    async delete_food(v) {
        let { data } = await admin_axios({
            url: '/delete_food',
            data: v
        })
        return data;
    },
    async estimate_delete(v) {
        let { data } = await admin_axios({
            url: '/estimate_delete',
            data: v
        })
        return data;
    },
    async save_staff(v) {
        let { data } = await admin_axios({
            url: '/save_staff',
            data: v
        })
        return data;
    },
    async delete_staff(v) {
        let { data } = await admin_axios({
            url: '/delete_staff',
            data: v
        })
        return data;
    },
    async save_user(v) {
        let { data } = await admin_axios({
            url: '/save_user',
            data: v
        })
        return data;
    },
    async delete_user(v) {
        let { data } = await admin_axios({
            url: '/delete_user',
            data: v
        })
        return data;
    },
    async add_food(v) {
        let { data } = await admin_axios({
            url: '/add_food',
            data: v
        })
        return data;
    },
    async add_staff(v) {
        let { data } = await admin_axios({
            url: '/add_staff',
            data: v
        })
        return data;
    },
    async add_user(v) {
        let { data } = await admin_axios({
            url: '/add_user',
            data: v
        })
        return data;
    },
    async search_trade(text) {
        let { data } = await admin_axios({
            url: '/search_trade',
            data: { text }
        })
        return data;
    },
    async set_user_notice(who, text) {
        let { data } = await admin_axios({
            url: '/set_user_notice',
            data: { who, text }
        })
        return data;
    },
    async get_log() {
        let { data } = await admin_axios({
            url: '/get_log',
        })
        return data
    },
    async search_log(text) {
        let { data } = await admin_axios({
            url: '/search_log',
            data: { text }
        })
        return data
    },
    async get_business() {
        let { data } = await admin_axios({
            url: '/get_business',
        })
        return data
    },
    async search_business(text) {
        let { data } = await admin_axios({
            url: '/search_business',
            data: { text }
        })
        return data
    },
    async add_business(obj) {
        let { data } = await admin_axios({
            url: '/add_business',
            data: obj
        })
        return data
    },
    async save_business(obj) {
        let { data } = await admin_axios({
            url: '/save_business',
            data: obj
        })
        return data
    },
    async delete_business(obj) {
        let { data } = await admin_axios({
            url: '/delete_business',
            data: obj
        })
        return data
    },
    async filter_trade(type) {
        let { data } = await admin_axios({
            url: '/filter_trade',
            data: { type }
        })
        return data
    },
}