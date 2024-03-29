import express from 'express'
import cors from 'cors'
import index from '../yumao/index_api'
import user from '../yumao/user_api'
import admin from '../yumao/admin_api'
import fs from 'fs'
import path from 'path'

let app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/api/v1/index', index)
app.use('/api/v1/user', user)
app.use('/api/v1/admin', admin)
app.listen(1000, async () => { console.log('后端启动,1000'); })

export default defineEventHandler(async(e) => {
  
})