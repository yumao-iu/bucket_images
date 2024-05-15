import express from 'express'
import tool from './tool'
let route = express.Router()
import utils_user from '../utils/user'
import config from './config'


//接口中间件
route.use((req, res, next) => { //诡异事件🤡:解析出的对象user_data属性user_name莫名其妙消失

    req.user_agent = req.headers['user-agent']
    req.x_ip = '127.0.0.1'
    if (req.headers.x_ip) req.x_ip = req.headers.x_ip

    let user_token = req.headers.authorization
    let user_data = tool.check_token(user_token)
    if (user_data != null) {
        req.user_id = user_data.id
        req.user_user = user_data.user
        req.user_name = user_data.name
        req.body.uid = user_data.id
        next()
    } else res.send({ msg: '访客未登录🤡 ！', code: 500 })
})
//余额购买
route.post('/balance_pay', async (req, res) => {
    let { fid, uid } = req.body
    let insert_data = {}
    let bill = (await tool.get_user_bill(uid))[0]
    let food = await tool.get_id_food(fid)
    let user = await tool.get_id_user(uid)
    let user_price = parseFloat(user.price)
    let food_price = parseFloat(food.price)
    if (food_price > user_price) res.send({ msg: '余额不足 😅' })
    insert_data = food
    insert_data.fid = fid
    insert_data.user_name = user.name
    insert_data.uid = req.user_id
    insert_data.out_trade_no = 'balance_pay'
    await tool.set_user_price('remove', uid, food_price)
    await tool.add_trade('insert', insert_data)
    await tool.set_user_bill({ uid, fid, type: '余额购买', old_price: bill.new_price, new_price: bill.new_price - food_price, change_price: food_price })
    res.send('200')
})
//支付接口
route.post('/pay', async (req, res) => {
    let { type, trade, info, uid } = req.body
    let data = null
    if (type == 'pay') data = await tool.alipay('pay', info);
    else if (type == 'query') { //购买菜品轮询查询
        data = await tool.alipay('query', { trade });
        let { code, tradeStatus, outTradeNo } = data
        if (code == '10000' && tradeStatus == 'TRADE_SUCCESS') {
            let flag = await tool.get_out_trade_on(outTradeNo)
            if (!flag) {
                info.fid = info.id
                info.out_trade_no = outTradeNo
                info.user_name = req.user_name
                let { fid } = info
                let bill_data = (await tool.get_user_bill(uid))[0]
                await tool.set_user_bill({ uid, fid, type: '扫码购买', old_price: bill_data.new_price, new_price: bill_data.new_price, change_price: info.price })
                await tool.add_trade('insert', info)
                await tool.add_out_trade_on(outTradeNo)
            }
        }
    } else if (type == 'add_query') { //余额充值轮询查询
        data = await tool.alipay('query', { trade });
        let { code, tradeStatus, outTradeNo } = data
        if (code == '10000' && tradeStatus == 'TRADE_SUCCESS') {
            let flag = await tool.get_out_trade_on(outTradeNo)
            let add_price = parseFloat(data.totalAmount)
            if (!flag) {
                let bill_data = (await tool.get_user_bill(uid))[0]
                bill_data.change_price = bill_data.new_price - bill_data.old_price
                await tool.set_user_bill({ uid, fid: '-1', type: '扫码充值', old_price: bill_data.new_price, new_price: bill_data.new_price + add_price, change_price: add_price })
                await tool.add_out_trade_on(outTradeNo)
                await tool.set_user_price('add', uid, add_price)
            }
        }
    }
    res.send({ data })
})
//获取订单信息
route.post('/get_trade', async (req, res) => {
    let data = await tool.get_user_trade(req.user_id, req.body.index);
    if (data.length) {
        data.forEach(v => {
            if (v.estimate == '1') v.estimate_text = '查看评价'
            else if (v.estimate == '0') v.estimate_text = '评价菜品'
            else if (v.estimate == '-1') v.estimate_text = '本人删除'
            else if (v.estimate == '-2') v.estimate_text = '管理删除'
            if (v.status == '1') v.status_text = '已完成'
            else if (v.status == '-1') v.status_text = '未完成'

        });
    }
    res.send(data)
})
//搜索订单信息
route.post('/search_trade', async (req, res) => {
    let { uid, text } = req.body
    let data = await utils_user.search_order(uid, text);
    if (data.length) {
        data.forEach(v => {
            if (v.estimate) v.estimate_text = '查看评价'
            else v.estimate_text = '评价菜品'
            if (v.status == '1') v.status_text = '已完成'
            else if (v.status == '-1') v.status_text = '未完成'
        });
    }
    res.send(data)
})
//搜索账单信息
route.post('/search_bill', async (req, res) => {
    let { uid, text } = req.body
    let data = await tool.search_bill(uid, text);
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
//获取用户账单
route.post('/get_bill', async (req, res) => {
    let { uid } = req.body
    let data = await tool.get_bill(uid);
    res.send(data)
})
//发送菜品评价
route.post('/send_estimate', async (req, res) => {
    let address = req.x_ip == '127.0.0.1' ? '本地发送' : await tool.get_ip_address(req.x_ip)
    let data = await tool.send_estimate(req.body, address);
    if (data) res.send({ message: 'success', code: 200 })
    else res.send({ message: 'error', code: 500 })
})
//删除菜品评价
route.post('/estimate_delete', async (req, res) => {
    config.db.execute('update t_trade set estimate=-1 where id = ?', [req.body.id])
    res.send({ message: 'success', code: 200 })
})
//获取用户日志
route.post('/get_log', async (req, res) => {
    let data = await tool.get_log('user', req.user_id)
    res.send(data)
})
//搜索用户日志
route.post('/search_log', async (req, res) => {
    let data = await tool.search_log('user', req.user_id, req.body.text)
    res.send(data)
})

export default route