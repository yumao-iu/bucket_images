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
    config.db.execute("update mess set content = ? where title = 'show_food'", [food_str])
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
    let { user, mail, pass, id, price } = req.body
    let temp_01 = await tool.check_exist('user', 'user', user)
    let temp_02 = await tool.check_exist('user', 'mail', mail)
    if (temp_01 && temp_01.id != id)
        res.send({ code: -1, msg: '失败,用户存在' })
    else if (temp_02 && temp_02.id != id)
        res.send({ code: -2, msg: '失败,邮箱存在' })
    else {
        config.db.execute('update user set user=?,mail=?,pass=?,price=? where id = ?', [user, mail, pass, price, id])
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
    config.db.execute('insert into staff(name,tel,sort,localtion) value(?,?,?,?)', [name, tel, sort, localtion])
    res.send('200')
})
//添加用户
route.post('/add_user', async (req, res) => {
    let { user, pass, mail } = req.body
    let temp_01 = await tool.check_exist('user', 'user', user)
    let temp_02 = await tool.check_exist('user', 'mail', mail)
    if (!temp_01 && !temp_02) {
        config.db.execute('insert into user(user,pass,mail) value(?,?,?)', [user, pass, mail])
        res.send({ code: 1, msg: '成功' })
    } else if (temp_01) res.send({ code: -1, msg: '失败,用户存在' })
    else if (temp_02) res.send({ code: -2, msg: '失败,邮箱存在' })

})





export default route