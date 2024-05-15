import express from 'express'
import tool from './tool'
let route = express.Router()
import config from './config'


// 接口中间件
route.use((req, res, next) => { //诡异事件🤡:解析出的对象user_data属性user_name莫名其妙消失
    let token_business = req.headers.authorization
    let data_business = tool.check_token(token_business)
    if (data_business != null) {
        req.business_id = data_business.id
        req.business_user = data_business.user
        req.business_name = data_business.name
        req.body.bid = data_business.id
        next()
    } else res.send({ msg: '访客未登录🤡 ！', code: 500 })
})

//获取食物信息
route.post('/get_food', async (req, res) => {
    let data = await tool.get_business_food(req.business_name);
    res.send(data)
})
//搜索食物信息
route.post('/search_food', async (req, res) => {
    let data = await tool.search_business_food(req.business_name, req.body.text);
    res.send(data)
})
//获取订单信息
route.post('/get_order', async (req, res) => {
    let data = await tool.get_business_trade(req.business_name,req.body.index);
    res.send(data)
})
//搜索订单信息
route.post('/search_trade', async (req, res) => {
    let { text } = req.body
    let data = await tool.business_search_order(req.business_name, text);
    res.send(data)
})
//设置订单状态
route.post('/set_trade_status', async (req, res) => {
    let { id, status } = req.body
    let set_status = status == '-1' ? '1' : '-1'
    config.db.execute('update t_trade set status=? where id = ?', [set_status, id])
    res.send({ code: 200 })
})

//修改账号
route.post('/set_user', async (req, res) => {
    let { text } = req.body
    let flag = await tool.check_business_info('user', { user: text, id: req.business_id })
    let code = 200
    if (flag) config.db.execute('update t_business set user = ? where id = ?', [text, req.business_id])
    else code = 500
    res.send({ code })
})
//设置电话
route.post('/set_tel', async (req, res) => {
    let { text } = req.body
    config.db.execute('update t_business set tel = ? where id = ?', [text, req.business_id])
    res.send({ code: 200 })
})
//设置密码
route.post('/set_pass', async (req, res) => {
    let { new_pass, old_pass } = req.body
    let flag = await tool.check_business_info('pass', { old_pass, id: req.business_id }), code = 200
    if (flag) config.db.execute('update t_business set pass = ? where id = ?', [new_pass, req.business_id])
    else code = 500
    res.send({ code })
})
//获取日志
route.post('/get_log', async (req, res) => {
    let data = await tool.get_business_log(req.business_id)
    if (data.length) {
        data.forEach(v => {
            v.time = v.time.replace('2024-', '')
            v.ip = v.ip.match(/内网/) ? '本地访问(127.0.0.1)' : v.ip
        });
    }
    res.send(data)
})
//获取日志
route.post('/search_log', async (req, res) => {
    let data = await tool.search_business_log(req.business_id, req.body.text)
    if (data.length) {
        data.forEach(v => {
            v.time = v.time.replace('2024-', '')
            v.ip = v.ip.match(/内网/) ? '本地访问(127.0.0.1)' : v.ip
        });
    }
    res.send(data)
})


export default route