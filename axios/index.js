import axios from 'axios'
import { indexStore } from '~/store'


let index_axios = axios.create({
    method: 'post',
    baseURL: 'http://127.0.0.1:1000/api/v1/index',
    // baseURL:'https://hl.sb:2000/api/v1/index',
    headers: {
        Authorization: 'jwt'
    }
})
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
    async business_login(info_obj) {
        let { data } = await index_axios({
            url: '/business_login',
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
    async balance_pay(fid) {
        let { data } = await index_axios({
            url: '/balance_pay',
            data: { fid }
        })
    },
    async add_order(out_trade_on) {
        let { data } = await index_axios({
            url: "/add_order",
            data: { out_trade_on },
        })
        return data
    },
    async get_list_estimate(id) {
        let { data } = await index_axios({
            url: "/get_list_estimate",
            data: { fid: id },
        })
        return data
    },
}