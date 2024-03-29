import { defineStore } from 'pinia'
import axios from '~/axios';

export let indexStore = defineStore('indexStore', {
    state() {
        return {
            init_data: null,
            token: 1,
        }
    },
    actions: {
        login_out(){
            this.$reset();
            localStorage.clear()
        },
    },
})