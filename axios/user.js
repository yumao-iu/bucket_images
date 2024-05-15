import axios from 'axios'
import { userStore } from '~/store/user'

let user_axios = axios.create({
    method: 'post',
    baseURL: 'http://127.0.0.1:1000/api/v1/user',
    // baseURL:'https://hl.sb:2000/api/v1/user',
})
user_axios.interceptors.request.use((config) => {
    let { user_token } = userStore()
    config.headers.Authorization = user_token
    return config
}, (err) => { console.log(err); })

user_axios.interceptors.response.use((config) => {
    return config
}, (err) => { console.log(err); })

export default {
    async balance_pay(fid) {
        let { data } = await user_axios({
            url: '/balance_pay',
            data: { fid }
        })
        return data
    },
    async pay(type, info) {
        let data = null
        if (type == 'pay') {
            if (!info?.price) return { 'msg': '参数错误', 'code': '40004' }
            data = await user_axios({
                url: '/pay',
                data: { type: 'pay', info }
            })
        } else if (type == 'query') {
            if (!info?.trade) return { 'msg': '参数错误', 'code': '40004' }
            data = await user_axios({
                url: '/pay',
                data: { type: 'query', trade: info.trade, info: info.info },
            })
        } else if (type == 'add_query') {
            if (!info?.trade) return { 'msg': '参数错误', 'code': '40004' }
            data = await user_axios({
                url: '/pay',
                data: { type: 'add_query', trade: info.trade },
            })
        }
        return data.data
    },
    async get_order(index) {
        let { data } = await user_axios({
            url: '/get_trade',
            data:{index}
        })
        return data
    },
    async get_notice() {
        let { data } = await user_axios({
            url: '/get_notice',
        })
        return data
    },
    async get_bill() {
        let { data } = await user_axios({
            url: '/get_bill',
        })
        return data
    },
    async search_bill(text) {
        let { data } = await user_axios({
            url: '/search_bill',
            data: { text }
        })
        return data
    },
    async search_trade(text) {
        let { data } = await user_axios({
            url: '/search_trade',
            data: { text }
        })
        return data
    },
    async update_user() {
        let { data } = await user_axios({
            url: '/update_user',
        })
        return data
    },
    async set_user_info(filed, info) {
        info = JSON.stringify(info)
        let { data } = await user_axios({
            url: '/set_user_info',
            data: { filed, info }
        })
        return data;
    },
    async send_estimate(text, food) {
        let { data } = await user_axios({
            url: '/send_estimate',
            data: { text, food }
        })
        return data;
    },
    async estimate_delete(food) {
        let { data } = await user_axios({
            url: '/estimate_delete',
            data: food
        })
        return data;
    },
    async get_log() {
        let { data } = await user_axios({
            url: '/get_log',
        })
        return data;
    },
    async search_log(text) {
        let { data } = await user_axios({
            url: '/search_log',
            data: { text }
        })
        return data;
    },
}