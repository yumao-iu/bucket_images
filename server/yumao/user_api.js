import express from 'express'
import tool from './tool'
let route = express.Router()
import utils_user from '../utils/user'

//接口中间件
route.use((req, res, next) => {
    let user_token = req.headers.authorization
    let user_data = tool.check_token(user_token)
    if (user_data != null) {
        req.user_id = user_data.id
        req.body.uid = user_data.id
        req.user_user = user_data.user
        next()
    } else res.send({ msg: '访客未登录🤡 ！', code: 500 })
})
//余额购买
route.post('/balance_pay', async (req, res) => {
    let { fid } = req.body
    let uid = req.user_id
    let insert_data = {}
    let food = await tool.get_id_food(fid)
    let user = await tool.get_id_user(uid)
    let user_price = user.price
    let food_price = food.price
    if (food_price > user_price) res.send({ msg: '余额不足 😅' })
    insert_data = food
    insert_data.fid = fid
    insert_data.uid = req.user_id
    insert_data.out_trade_no = 'balance_pay'
    await tool.set_user_price('remove', uid, food_price)
    await tool.add_trade('insert', insert_data)
    res.send('200')
})
//获取订单信息
route.post('/get_trade', async (req, res) => {
    let data = await tool.get_user_trade(req.user_id);
    res.send(data)
})
//获取订单信息
route.post('/search_trade', async (req, res) => {
    let { uid, text } = req.body
    let data = await utils_user.search_order(uid, text);
    res.send(data)
})
//更新用户信息
route.post('/update_user', async (req, res) => {
    let { uid } = req.body
    let data = await tool.update_user_data(uid);
    res.send(data)
})
//修改用户信息
route.post('/set_user_info', async (req, res) => {
    let { filed, info, uid } = req.body
    let msg = { msg: '修改失败错误！', code: 300 }
    let user_data = await tool.get_id_user(uid);
    info = JSON.parse(info)
    if (filed == 'pass') {
        if (user_data.pass == info.old_pass) {
            msg.msg = 'success!'
            msg.code = 200
            await tool.set_table_filed('user', filed, info.new_pass, uid);
        }
    } else if (filed == 'name') {
        msg.msg = 'success!'
        msg.code = 200
        await tool.set_table_filed('user', filed, info.name, uid);
    } else if (filed == 'user') {
        let temp = await tool.check_exist('user', 'user', info.user)
        if (!temp || temp.id == uid) {
            msg.msg = 'success!'
            msg.code = 200
            await tool.set_table_filed('user', filed, info.user, uid);
        }
    } else if (filed == 'mail') {
        let temp = await tool.check_exist('user', 'mail', info.mail)
        if (!temp || temp.id == uid) {
            msg.msg = 'success!'
            msg.code = 200
            await tool.set_table_filed('user', filed, info.mail, uid);
        }
    }
    res.send(msg)
})
//获取用户公告
route.post('/get_notice', async (req, res) => {
    let data = await tool.get_mess('user_notice');
    res.send(data)
})


export default route