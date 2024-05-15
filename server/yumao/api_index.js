import express from 'express'
import tool from './tool'
import config from './config'

let route = express.Router()

route.use((req, res, next) => {
    req.user_agent = req.headers['user-agent']
    req.x_ip = '127.0.0.1'
    if (req.headers.x_ip) req.x_ip = req.headers.x_ip
    next()
})

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
        let address = await tool.get_ip_address(req.x_ip)
        let data_admin = await tool.get_admin({ user: data.user, mail: '-1' })
        await tool.add_log({ aid: data_admin.id, uid: '-1', bid: '-1', content: '登录后台', ip: address + `(${req.x_ip})`, device: req.user_agent })
        message.token = tool.set_token({ id: data_admin.id, power: 'admin', user: data.user }, 60 * 60 * 24)
        message.data = { id: data.id, user: data.user, mail: data.mail }
    }
    res.send(message);
})
//用户登录
route.post('/user_login', async (req, res) => {
    let data = await tool.user_login(req.body)
    let msg = { code: 1 }
    if (!data) msg.code = 0
    else {
        let address = await tool.get_ip_address(req.x_ip)
        let data_user = await tool.get_user({ user: data.user, name: '', mail: '' })
        delete data.pass, msg.token = tool.set_token({ power: 'user', id: data.id, user: data.user, name: data.name }), msg.data = data;
        tool.add_log({ aid: '-1', uid: data_user.id, bid: '-1', content: '登录后台', ip: address + `(${req.x_ip})`, device: req.user_agent })
    }
    res.send(msg);
})
//商家登录
route.post('/business_login', async (req, res) => {
    let data = await tool.business_login(req.body)
    let msg = { code: 1 }
    if (!data) msg.code = 0
    else {
        let address = await tool.get_ip_address(req.x_ip)
        let data_business = await tool.get_business_info({ user: data.user, name: '', mail: '' })
        delete data_business.pass, msg.token = tool.set_token({ power: 'business', id: data_business.id, user: data_business.user, name: data_business.name }), msg.data = data;
        tool.add_log({ aid: '-1', uid: '-1', bid: data_business.id, content: '登录后台', ip: address + `(${req.x_ip})`, device: req.user_agent })
    }
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
        config.db.execute("insert into t_bill(uid,fid,type,old_price,new_price,change_price,time) value(?,'-1','用户注册',0,0,0,now())", [data.id])
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
//增加订单
route.post('/add_order', async (req, res) => {
    let { out_trade_on } = req.body

    res.send('200')
})
//获取食物评价
route.post('/get_list_estimate', async (req, res) => {
    let { fid } = req.body
    let data = await tool.get_list_estimate(fid);
    if (data.length) //使用async foreach直接报错
        for (let i = 0; i < data.length; i++) {
            let user_data = await tool.get_id_user(data[i].uid)
            data[i].name = user_data.name
        }
    res.send(data)
})
//添加日志
route.post('/add_log', async (req, res) => {
    console.log(req.body);
    res.send({ message: 'success', code: 200 })
})




export default route