import { defineStore } from 'pinia'
import business_api from '~/axios/business'

export let businessStore = defineStore('businessStore', {
    state() {
        return {

            trade_status: '-1',
            selected_trade: '',

            data_business: '',
            token_business: '',

            order_data:'',


            show_select_status: false,
            business_data: '',
            current_edit_food: '',
            estimate_status: 0,
            v_model_estimate_text: '',
            show_estimate_index: false,   //默认关闭
        }
    },
    actions: {
        login_out() {
            localStorage.clear()
            this.$reset()
            useRouter().push({ path: '/' })
        },
        // async update_user() {
        //     let { data, token } = await business_api.update_business()
        //     this.$state.user_data = data
        //     this.$state.user_token = token
        // },
    },
    persist: true,
})