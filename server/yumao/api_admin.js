import express from 'express'
import tool from './tool'
import config from './config'
import fs from 'fs-extra'
import path from 'path'

let { db } = config
let route = express.Router()
let __dirname = path.resolve()
let imgUrl = ''
console.log(process.env.NODE_ENV, __dirname);
if (process.env.NODE_ENV == 'development') imgUrl = __dirname + '/public/images/'
else imgUrl = __dirname + '/.output/public/images/'

//接口中间件
route.use((req, res, next) => {
    let admin_token = req.headers.authorization
    let admin_data = tool.check_token(admin_token)
    if (admin_data != null) {
        req.body.admin_id = admin_data.id
        req.admin_id = admin_data.id
        req.user = admin_data.user
        req.power = admin_data.power
        next()
    }
    // else res.sendStatus(300);
})
//设置轮播图
route.post('/set_swiper', tool.upload, async (req, res) => {
    let files = req.files
    let data = await tool.get_swiper()
    for (let i = 0; i < data.length; i++)
        fs.removeSync(imgUrl + data[i].img);
    config.db.execute('delete from swiper')
    for (let i = 0; i < files.length; i++) {
        let newname = files[i].filename + '.' + files[i].mimetype.split('/')[1]
        let oldPath = imgUrl + files[i].filename
        let newPath = imgUrl + newname
        fs.moveSync(oldPath, newPath)
        await tool.set_swiper(newname)
    }
    res.send('200')
})
//设置新闻
route.post('/set_news', async (req, res) => {
    let { title, link, id } = req.body
    config.db.execute('update news set title = ? , link = ? where id = ?', [title, link, id])
    res.send('200')
})
//设置其他信息
route.post('/set_other', async (req, res) => {
    let { content, id } = req.body
    config.db.execute('update detail set content = ? where id = ?', [content, id])
    res.send('200')
})
//获取员工信息
route.post('/get_staff', async (req, res) => {
    let data = await tool.get_staff()
    res.send(data)
})
//获取用户信息
route.post('/get_user', async (req, res) => {
    let data = await tool.get_all_user()
    res.send(data)
})
//获取食物信息
route.post('/get_food', async (req, res) => {
    let data = await tool.get_food()
    res.send(data)
})
//设置管理员信息
route.post('/set_account', async (req, res) => {
    let { old_pass, id } = req.body
    let flag = await tool.check_old_pass({ id, old_pass, })
    if (flag) {
        let code = await tool.set_account(req.body)
        if (code) res.send({ msg: 'success', state: 200 })
    } else res.send({ msg: 'error', state: 300 })
})
//设置展示食物
route.post('/set_food_show', async (req, res) => {
    let { food_str } = req.body
    config.db.execute("update t_mess set content = ? where title = 'show_food'", [food_str])
    res.send('200')
})
//搜索食物
route.post('/search_food', async (req, res) => {
    let { text } = req.body
    let data = await tool.search_admin_food(text)
    res.send(data)
})
//搜索员工
route.post('/search_staff', async (req, res) => {
    let { text } = req.body
    let data = await tool.search_staff(text)
    res.send(data)
})
//搜索用户
route.post('/search_user', async (req, res) => {
    let { text } = req.body
    let data = await tool.search_user(text)
    res.send(data)
})
//搜索评价
route.post('/search_estimate', async (req, res) => {
    let { text } = req.body
    let data = await tool.search_estimate(text)
    res.send(data)
})
//添加食物
route.post('/add_food', tool.upload, async (req, res) => {
    let { data } = req.body
    data = JSON.parse(data)
    if (req.files.length) {
        let old_img = req.files[0].filename
        let mimetype = req.files[0].mimetype.split('/')[1]
        let new_img = old_img + '.' + mimetype
        data.img = new_img
        fs.moveSync(imgUrl + old_img, imgUrl + new_img)
    } else data.img = 'default.jpg'

    tool.add_food(data);
    res.send('200')
})
//编辑食物
route.post('/save_food', tool.upload, async (req, res) => {
    let { data } = req.body
    let files = req.files[0]
    let new_img = null
    data = JSON.parse(data)
    let { name, detail, introduce, localtion, price, id, img } = data
    if (files) {
        let img_name = files.filename
        new_img = img_name + '.' + files.mimetype.split('/')[1]
        fs.removeSync(imgUrl + img);
        fs.moveSync(imgUrl + img_name, imgUrl + new_img)
    } else new_img = img
    db.execute('update food set name=?,detail=?,introduce=?,localtion=?,price=?,img=? where id = ?', [name, detail, introduce, localtion, price, new_img, id])
    res.send('200')
})
//删除食物
route.post('/delete_food', async (req, res) => {
    let { name, detail, introduce, localtion, price, img, id } = req.body
    config.db.execute('delete from food where id =  ?', [id])
    if (img != 'default.jpg') fs.removeSync(imgUrl + img)
    res.send('200')
})
//删除评价
route.post('/estimate_delete', async (req, res) => {
    config.db.execute('update trade set estimate=-2 where id = ?', [req.body.id])
    res.send({ message: 'success', code: 200 })
})
//编辑员工
route.post('/save_staff', async (req, res) => {
    let { name, sort, tel, localtion, id } = req.body
    config.db.execute('update staff set name=?,sort=?,tel=?,localtion=? where id = ?', [name, sort, tel, localtion, id])
    res.send('200')
})
//删除员工
route.post('/delete_staff', async (req, res) => {
    let { id } = req.body
    config.db.execute('delete from staff where id =  ?', [id])
    res.send('200')
})
//编辑用户
route.post('/save_user', async (req, res) => {
    let { user, mail, pass, id, price, name } = req.body
    let temp_01 = await tool.check_exist('user', 'user', user)
    let temp_02 = await tool.check_exist('user', 'mail', mail)
    if (temp_01 && temp_01.id != id)
        res.send({ code: -1, msg: '失败,用户存在' })
    else if (temp_02 && temp_02.id != id)
        res.send({ code: -2, msg: '失败,邮箱存在' })
    else {
        config.db.execute('update user set user=?,mail=?,pass=?,price=?,name=? where id = ?', [user, mail, pass, price, name, id])
        res.send({ code: 1, msg: '成功' })
    }
})
//删除用户
route.post('/delete_user', async (req, res) => {
    let { id } = req.body
    config.db.execute('delete from user where id =  ?', [id])
    res.send('200')
})
//添加员工
route.post('/add_staff', async (req, res) => {
    let { name, tel, sort, localtion } = req.body
    config.db.execute('insert into t_staff(name,tel,sort,localtion) value(?,?,?,?)', [name, tel, sort, localtion])
    res.send('200')
})
//添加用户
route.post('/add_user', async (req, res) => {
    let { user, pass, mail } = req.body
    let temp_01 = await tool.check_exist('user', 'user', user)
    let temp_02 = await tool.check_exist('user', 'mail', mail)
    if (!temp_01 && !temp_02) {
        config.db.execute(`insert into t_user(user,pass,mail,name) value(?,?,?,'用户_${parseInt(Math.random() * 10000000)}')`, [user, pass, mail])
        let data = await tool.get_user_user(user)
        config.db.execute("insert into t_bill(uid,fid,type,old_price,new_price,change_price,time) value(?,'-1','用户注册',0,0,0,now())", [data.id])
        res.send({ code: 1, msg: '成功' })
    } else if (temp_01) res.send({ code: -1, msg: '失败,用户存在' })
    else if (temp_02) res.send({ code: -2, msg: '失败,邮箱存在' })

})
//获取全部订单
route.post('/get_all_trade', async (req, res) => {
    let data = await tool.get_all_trade()
    if (data.length) {
        data.forEach(v => {
            if (v.estimate_content == null) v.estimate_content = '未评价'
            v.status_text = v.status == '1' ? '已完成' : '未完成'
            v.time = v.time.replace('2024-', '')
            if (v.estimate == '1') v.estimate_text = '正常评价'
            else if (v.estimate == '0') v.estimate_text = '等待评价'
            else if (v.estimate == '-1') v.estimate_text = '本人删除'
            else if (v.estimate == '-2') v.estimate_text = '管理删除'
        });
    }
    res.send(data)
})
//搜索订单
route.post('/search_trade', async (req, res) => {
    let data = await tool.search_trade(req.body.text)
    if (data.length) {
        data.forEach(v => {
            if (v.estimate_content == null) v.estimate_content = '未评价'
            v.status_text = v.status == '1' ? '已完成' : '未完成'
            v.time = v.time.replace('2024-', '')
            if (v.estimate == '1') v.estimate_text = '正常评价'
            else if (v.estimate == '0') v.estimate_text = '等待评价'
            else if (v.estimate == '-1') v.estimate_text = '本人删除'
            else if (v.estimate == '-2') v.estimate_text = '管理删除'
        });
    }
    res.send(data)
})
//修改用户公告
route.post('/set_user_notice', async (req, res) => {
    if (req.body.who == 'user')
        config.db.execute("update t_mess set content = ? where title = 'user_notice'", [req.body.text])
    else
        config.db.execute("update t_mess set content = ? where title = 'business_notice'", [req.body.text])
    res.send({ message: 'success', code: 200 })
})
//获取管理日志
route.post('/get_log', async (req, res) => {
    let data = await tool.get_log('admin', '1');
    res.send(data)
})
//搜索管理日志
route.post('/search_log', async (req, res) => {
    let data = await tool.search_log('admin', '1', req.body.text);
    res.send(data)
})
//获取商家信息
route.post('/get_business', async (req, res) => {
    let data = await tool.get_business();
    res.send(data)
})
//搜索商家信息
route.post('/search_business', async (req, res) => {
    let data = await tool.search_business(req.body.text);
    res.send(data)
})

//添加商家信息
route.post('/add_business', async (req, res) => {
    let { name, user, pass, tel, people } = req.body
    let check1 = await tool.check_business_info('admin_check_name', req.body)
    let check2 = await tool.check_business_info('admin_check_user', req.body)
    let code = 200
    if (check1) code = 300
    if (check2) code = 500
    if (code == 200) config.db.execute('insert into t_business(name, user, pass, tel, people) value(?,?,?,?,?)', [name, user, pass, tel, people])
    res.send({ code })
})
//编辑商家信息
route.post('/save_business', async (req, res) => {
    let { name, user, pass, tel, people, id } = req.body
    let code = 200
    let check1 = await tool.check_business_info('admin_save_name', req.body)
    let check2 = await tool.check_business_info('admin_save_user', req.body)
    if (check1) code = 300
    if (check2) code = 500
    if (code == 200) config.db.execute('update t_business set name=?, user=?, pass=?, tel=?, people=? where id = ?', [name, user, pass, tel, people, id])
    res.send({ code })
})
//删除商家
route.post('/delete_business', async (req, res) => {
    let { name, user, pass, tel, people, id } = req.body
    config.db.execute('delete from t_business where id = ?', [id])
    res.send({ code: 200 })
})
//过滤订单
route.post('/filter_trade', async (req, res) => {
    let { type } = req.body
    let data = await tool.admin_filter_trade(type);
    if (data.length) {
        data.forEach(v => {
            if (v.estimate_content == null) v.estimate_content = '未评价'
            v.status_text = v.status == '1' ? '已完成' : '未完成'
            v.time = v.time.replace('2024-', '')
            if (v.estimate == '1') v.estimate_text = '正常评价'
            else if (v.estimate == '0') v.estimate_text = '等待评价'
            else if (v.estimate == '-1') v.estimate_text = '本人删除'
            else if (v.estimate == '-2') v.estimate_text = '管理删除'
        });
    }
    res.send(data)
})


export default route