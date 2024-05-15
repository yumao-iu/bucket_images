import axios from 'axios'
import { businessStore } from '~/store/business'

let business_axios = axios.create({
    method: 'post',
    baseURL: 'http://127.0.0.1:1000/api/v1/business',
    // baseURL:'https://hl.sb:2000/api/v1/business',
})
business_axios.interceptors.request.use((config) => {
    let { token_business } = businessStore()
    config.headers.Authorization = token_business
    return config
}, (err) => { console.log(err); })

business_axios.interceptors.response.use((config) => {
    return config
}, (err) => { console.log(err); })

export default {
    async get_food() {
        let { data } = await business_axios({
            url: '/get_food',
        })
        return data
    },
    async search_food(text) {
        let { data } = await business_axios({
            url: '/search_food',
            data: { text },
        })
        return data
    },
    async get_order(index) {
        let { data } = await business_axios({
            url: '/get_order',
            data: { index }
        })
        if (data.length)
            data.forEach(v => {
                v.method = v.out_trade_on == 'balance_pay' ? '余额支付' : '扫码支付'
                v.status_text = v.status == "-1" ? "未完成" : "已完成";
            });
        return data
    },
    async search_trade(text) {
        let { data } = await business_axios({
            url: '/search_trade',
            data: { text }
        })
        if (data.length)
            data.forEach(v => {
                v.method = v.out_trade_on == 'balance_pay' ? '余额支付' : '扫码支付'
                v.status_text = v.status == "-1" ? "未完成" : "已完成";
            });
        return data
    },
    async set_trade_status(obj) {
        let { data } = await business_axios({
            url: '/set_trade_status',
            data: obj
        })
        return data
    },
    async set_user(text) {
        let { data } = await business_axios({
            url: '/set_user',
            data: { text }
        })
        return data
    },
    async set_tel(text) {
        let { data } = await business_axios({
            url: '/set_tel',
            data: { text }
        })
        return data
    },
    async set_pass(account) {
        let { data } = await business_axios({
            url: '/set_pass',
            data: account
        })
        return data
    },
    async get_log() {
        let { data } = await business_axios({
            url: '/get_log',
        })
        return data
    },
    async search_log(text) {
        let { data } = await business_axios({
            url: '/search_log',
            data: { text }
        })
        return data
    },

}

