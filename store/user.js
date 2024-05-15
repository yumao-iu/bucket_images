import { defineStore } from 'pinia'
import user_api from '~/axios/user'

export let userStore = defineStore('userStore', {
    state() {
        return {
            user_data: '',
            user_token: '',
            current_edit_food:'',
            estimate_status:0,
            v_model_estimate_text:'',
            show_estimate_index: false,   //默认关闭
        }
    },
    actions: {
        login_out() {
            localStorage.clear()
            this.$reset()
            useRouter().push({ path: '/' })
        },
        async update_user() {
            let { data, token } = await user_api.update_user()
            this.$state.user_data = data
            this.$state.user_token = token
        },
        show_estimate(v) {
            if(!this.$state.show_estimate_index) this.$state.v_model_estimate_text = ''
            this.$state.estimate_status = v.estimate
            this.$state.current_edit_food = v
            this.$state.show_estimate_index = this.$state.show_estimate_index ? false : true 
        }
    },
    persist: true,
})