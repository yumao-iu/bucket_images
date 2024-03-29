import express from 'express'
import tool from './tool'

let route = express.Router()

//获取首页初始数据
route.post('/init_data', async (req, res) => {
    let data = await tool.get_init_data()
    res.send(data);
})
//首页搜索食物
route.post('/search_food', async (req, res) => {
    let { name } = req.body
    let data = await tool.search_food(name)
    res.send(data);
})
//管理员登录
route.post('/admin_login', async (req, res) => {
    let data = await tool.admin_login(req.body)
    let message = { code: 1 }
    if (!data) message.code = 0
    else {
        message.token = tool.set_token({ id: data.id, power: 'admin', user: data.user }, 60 * 60 * 24)
        message.data = { id: data.id, user: data.user, mail: data.mail }
    }
    res.send(message);
})
//用户登录
route.post('/user_login', async (req, res) => {
    let data = await tool.user_login(req.body)
    let msg = { code: 1 }
    if (!data) msg.code = 0
    else delete data.pass, msg.token = tool.set_token({ power: 'user', id: data.id, user: data.user }), msg.data = data
    res.send(msg);
})
//用户注册
route.post('/user_reg', async (req, res) => {
    let { user } = req.body
    let { flag } = await tool.user_check(req.body)
    let msg = { code: flag }
    if (flag == 0) {
        let data = await tool.get_user_user(user)
        msg.token = tool.set_token({ power: 'user', user, id: data.id }), msg.data = data
    }
    res.send(msg);
})
//用户找回
route.post('/user_find', async (req, res) => {
    let { code } = await tool.user_find(req.body)
    res.send({ code })
})
//用户找回
route.post('/check_find', async (req, res) => {
    let { token } = req.body;
    let { code } = await tool.check_find(token)
    res.send({ code })
})
//支付接口
route.post('/pay', async (req, res) => {
    let { type, trade, info } = req.body
    let data = null
    let update_user_data = false;
    if (type == 'pay') data = await tool.alipay('pay', info);
    else if (type == 'query') {
        data = await tool.alipay('query', { trade });
        let { code, tradeStatus, outTradeNo } = data
        if (code == '10000' && tradeStatus == 'TRADE_SUCCESS') {
            let flag = await tool.get_out_trade_on(outTradeNo)
            if (!flag) {
                info.fid = info.id
                info.out_trade_no = outTradeNo
                await tool.add_trade('insert', info)
                await tool.add_out_trade_on(outTradeNo)
            }
        }
    } else if (type == 'add_query') {
        let user_token = req.headers.authorization
        let user_data = tool.check_token(user_token)
        if (!user_data) return 0;
        let { id } = user_data
        data = await tool.alipay('query', { trade });
        let { code, tradeStatus, outTradeNo } = data
        if (code == '10000' && tradeStatus == 'TRADE_SUCCESS') {
            let flag = await tool.get_out_trade_on(outTradeNo)
            let add_price = data.totalAmount
            if (!flag) {
                await tool.add_out_trade_on(outTradeNo)
                await tool.set_user_price('add', id, add_price)
            }
        }
    }
    
    res.send({ data })
})
//增加订单
route.post('/add_order', async (req, res) => {
    let { out_trade_on } = req.body

    res.send('200')
})



export default route