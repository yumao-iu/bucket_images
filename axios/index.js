import axios from 'axios'
import { indexStore } from '~/store'


let index_axios = axios.create({
    method: 'post',
    baseURL:'https://hl.sb:2000/api/v1/index',
    headers: {
        Authorization: 'jwt'
    }
})
// 00ce0ea17733c7684b64df03890d9f9c
index_axios.interceptors.request.use((config) => {
    return config
}, (err) => { console.log(err); })

index_axios.interceptors.response.use((config) => {
    return config
}, (err) => { console.log(err); })

export default {
    async init_data() {
        let { data } = await index_axios({
            url: '/init_data',
        })
        return data;
    },
    async search_food(name) {
        let { data } = await index_axios({
            url: '/search_food',
            data: { name }
        })
        return data;
    },
    async admin_login(info_obj) {
        let { data } = await index_axios({
            url: '/admin_login',
            data: info_obj
        })
        return data;
    },
    async user_login(info_obj) {
        let { data } = await index_axios({
            url: '/user_login',
            data: info_obj
        })
        return data;
    },
    async user_reg(info_obj) {
        let { data } = await index_axios({
            url: '/user_reg',
            data: info_obj
        })
        return data;
    },
    async user_find(info_obj) {
        let { data } = await index_axios({
            url: '/user_find',
            data: info_obj
        })
        return data;
    },
    async check_find(token) {
        let { data } = await index_axios({
            url: '/check_find',
            data: { token }
        })
        return data;
    },
    async pay(type, info) {
        let data = null
        if (type == 'pay') {
            if (!info?.price) return { 'msg': '参数错误', 'code': '40004' }
            data = await index_axios({
                url: '/pay',
                data: { type: 'pay', info }
            })
        } else if (type == 'query') {
            if (!info?.trade) return { 'msg': '参数错误', 'code': '40004' }
            data = await index_axios({
                url: '/pay',
                data: { type: 'query', trade: info.trade, info: info.info }
            })
        } else if (type == 'add_query') {
            if (!info?.trade) return { 'msg': '参数错误', 'code': '40004' }
            data = await index_axios({
                url: '/pay',
                data: { type: 'add_query', trade: info.trade },
                headers: {
                    Authorization: info.token
                }
            })
        }

        return data.data
    },
    async balance_pay(fid) {
        let { data } = await index_axios({
            url: '/balance_pay',
            data: { fid }
        })
    },
    async add_order(out_trade_on) {
        let { data } = index_axios({
            url: "/add_order",
            data: { out_trade_on },
        })
        return data
    }
}