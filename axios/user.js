import axios from 'axios'
import { userStore } from '~/store/user'


let user_axios = axios.create({
    method: 'post',
    baseURL:'https://hl.sb:2000/api/v1/user',
    headers: {
        Authorization: 'jwt'
    }
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
    async get_order() {
        let { data } = await user_axios({
            url: '/get_trade',
        })
        return data
    },
    async get_notice() {
        let { data } = await user_axios({
            url: '/get_notice',
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
        let  {data} = await user_axios({
            url: '/set_user_info',
            data: { filed, info }
        })
        return data;
    }
}