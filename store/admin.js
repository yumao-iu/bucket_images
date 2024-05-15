import { defineStore } from 'pinia'
export let adminStore = defineStore('adminStore', {
    state() {
        return {
            admin_token: '',
            admin_data: '',
        }
    },
    actions: {
        login_out() {
            localStorage.clear()
            this.$reset()
            useRouter().push({ path: '/' })
        }
    },
    persist: true,
})