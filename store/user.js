import { defineStore } from 'pinia'
import user_api from '~/axios/user'

export let userStore = defineStore('userStore', {
    state() {
        return {
            user_data: '',
            user_token: '',
        }
    },
    actions: {
        login_out() {
            localStorage.clear()
            this.$reset()
            location.href = '/'
        },
        async update_user() {
            let { data, token } = await user_api.update_user()
            this.$state.user_data = data
            this.$state.user_token = token
        }
    },
    persist: true,
})