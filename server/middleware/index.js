import cors from 'cors'
import moment from 'moment'
import express from 'express'
import tool from '../yumao/tool'
import user from '../yumao/api_user'
import index from '../yumao/api_index'
import admin from '../yumao/api_admin'
import business from '../yumao/api_business'
// import { config } from '~/composables/config.js'


let app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/api/v1/user', user)
app.use('/api/v1/index', index)
app.use('/api/v1/admin', admin)
app.use('/api/v1/business', business)

// let c = config()
// console.log(c.a);

app.listen(1000, async () => { console.log('后端启动,1000 '); console.log('校队时间:' + moment().local('zh-cn').format('YYYY-MM-DD HH:mm:ss')); })

export default defineEventHandler(async (e) => {
    // console.log(await tool.get_ip_address('171.110.245.49'));
})