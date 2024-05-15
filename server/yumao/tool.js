import config from "./config"
import jwt from 'jsonwebtoken'
import multer from 'multer'
import AlipaySdk from "alipay-sdk";
import moment from "moment";
import Searcher from '../yumao/address_search'
import path from 'path'

const alipaySdk = new AlipaySdk({
    appId: config.alipay.id,
    privateKey: config.alipay.privateKey,
    alipayPublicKey: config.alipay.publicKey
});

let img_dest = ''
let other_dest = ''
if (process.env.NODE_ENV == 'development') img_dest = './public/images', other_dest = path.join(path.resolve(), './public/other/')
else img_dest = '.output/public/images', other_dest = path.join(path.resolve(), '.output/public/other/')



let upload = multer({
    dest: img_dest, //这个目录相对于项目文件中node_modules 
    limits: {
        files: 9,
        fields: 10,
        fileSize: 10.5 * 1024 * 1024
    }
}).array('files', 9)

let { db, token_secret, mail } = config
let _mail = mail


export default {
    //上传文件中间件
    upload,
    //生成token
    set_token(obj, time = 3600) {
        return jwt.sign(obj, token_secret, { expiresIn: time, algorithm: 'HS512' })
    },
    //验证token
    check_token(token) {
        let data = null
        jwt.verify(token, token_secret, (err, decode) => { if (decode) data = decode; })
        return data
    },
    //检查重复数据
    async check_exist(table, filed, value) {
        let flag = 0;
        if (table == 'user') {
            if (filed == 'user') {
                let data = await this.get_user({ name: null, user: value, mail: null })
                if (data) flag = data
            } else if (filed == 'mail') {
                let data = await this.get_user({ name: null, user: null, mail: value })
                if (data) flag = data
            } else if (filed == 'name') {
                let data = await this.get_user({ name: value, user: null, mail: value })
                if (data) flag = data
            }
        } else if (table == 'admin') {
            if (filed == 'user') {
                let data = await this.get_admin({ user: value, mail: null })
                if (data) flag = data
            } else if (filed == 'mail') {
                let data = await this.get_admin({ user: null, mail: value })
                if (data) flag = data
            }
        }
        return flag;
    },
    //首页轮播图
    get_swiper() {
        return new Promise((solve, reject) => {
            db.execute('select * from t_swiper', (err, result) => {
                solve(result);
            })
        })
    },
    //首页新闻
    get_news() {
        return new Promise((solve, reject) => {
            db.execute('select * from t_news', (err, result) => {
                solve(result);
            })
        })
    },
    //首页食物
    get_show_food_1() {
        return new Promise((solve, reject) => {
            db.execute("select * from t_mess where title = 'show_food'", (err, result) => {
                solve(result[0].content);
            })
        })
    },
    //首页食物
    get_show_food_2(food_str) {

        return new Promise((solve, reject) => {
            db.execute(`select * from t_food where id in (${food_str}) order by id asc`, (err, result) => {
                solve(result);
            })
        })
    },
    //首页信息
    get_detail() {
        return new Promise((solve, reject) => {
            db.execute('select * from t_detail', (err, result) => {
                solve(result);
            })
        })
    },
    //返回首页初始数据
    async get_init_data() {
        return new Promise(async (solve, reject) => {
            let data = {}
            data.news = await this.get_news()
            data.detail = await this.get_detail()
            data.swiper = await this.get_swiper()
            data.food_1 = await this.get_show_food_1()
            data.food = await this.get_show_food_2(data.food_1)
            data.user_notice = await this.get_mess('user_notice');
            data.business_notice = await this.get_mess('business_notice');
            delete data.food_1
            solve(data)
        })
    },
    //返回搜索食物
    async search_food(name) {
        return new Promise(async (solve, reject) => {
            db.execute(`select * from t_food where name like '%${name}%'`, (err, result) => {
                solve(result)
            })
        })
    },
    //搜索用户账单
    async search_bill(uid, text) {
        return new Promise(async (solve, reject) => {
            db.execute(`select * from t_bill where uid = ${uid} and (type like '%${text}%' or time like '%${text}%' or fid like '%${text}%') order by id desc`, (err, result) => {
                if (result) {
                    result = this.filter_time(result)
                    solve(result)
                }
            })
        })
    },
    //返回管理员搜索食物
    async search_admin_food(text) {
        return new Promise(async (solve, reject) => {
            db.execute(`select * from t_food where name like '%${text}%' or detail like '%${text}%' or introduce like '%${text}%' or localtion like '%${text}%' order by id desc`, (err, result) => {
                solve(result)
            })
        })
    },
    //管理员登录
    async admin_login(info) {
        return new Promise(async (solve, reject) => {
            let { user, pass } = info
            db.execute(`select * from t_admin where user = ? and pass = ?`, [user, pass], (err, result) => {
                if (result) solve(result[0])
                else console.log('error');
            })
        })
    },
    //获取某管理信息
    async get_admin(info) {
        return new Promise(async (solve, reject) => {
            let { user, mail } = info
            db.execute('select * from t_admin where user = ? or mail = ?', [user, mail], (err, result) => {
                if (result.length) {
                    solve(result[0])
                } else solve(0)
            })
        })
    },
    //获取某用户信息
    async get_user(info) {
        return new Promise(async (solve, reject) => {
            let { name, user, mail } = info
            db.execute('select * from t_user where user = ? or mail = ? or name = ?', [user, mail, name], (err, result) => {
                if (result.length) {
                    solve(result[0])
                } else solve(0)
            })
        })
    },
    //获取某商家信息（模糊）
    async get_business_info(info) {
        return new Promise(async (solve, reject) => {
            let { name, user, mail } = info
            db.execute('select * from t_business where user = ?  or name = ?', [user, name], (err, result) => {
                if (result.length) {
                    solve(result[0])
                } else solve(0)
            })
        })
    },
    //用户登录
    async user_login(info) {
        return new Promise(async (solve, reject) => {
            let { user, pass } = info
            db.execute(`select * from t_user where user = ? and pass = ?`, [user, pass], (err, result) => {
                if (result) solve(result[0])
                else console.log('error');
            })
        })
    },
    //商家登录
    async business_login(info) {
        return new Promise(async (solve, reject) => {
            let { user, pass } = info
            db.execute(`select * from t_business where user = ? and pass = ?`, [user, pass], (err, result) => {
                if (result) solve(result[0])
                else console.log('error');
            })
        })
    },
    //用户注册检查
    async user_check(info) {
        return new Promise(async (solve, reject) => {
            let { user, pass, mail } = info
            let msg = { flag: 0 }
            let data_01 = await this.check_exist('user', 'user', user)
            if (data_01) msg.flag = -1
            let data_02 = await this.check_exist('user', 'mail', mail)
            if (data_02) msg.flag = -2
            if (!data_01 && !data_02)
                db.execute(`insert into user(user,pass,mail,name) value(?,?,?,'用户_${parseInt(Math.random() * 10000000)}')`, [user, pass, mail])
            solve(msg)
        })
    },
    //用户账号找回
    async user_find(info) {
        return new Promise(async (solve, reject) => {
            let { user, pass, mail } = info
            info.name = -1
            let data_01 = await this.check_exist('user', 'user', user)
            let data_02 = await this.check_exist('user', 'mail', mail)
            if (data_01 || data_02) {
                let user_data = await this.get_user(info);
                let token = this.set_token({ user, pass }, 300);
                await _mail.sendMail({
                    from: "mm1799498990@163.com",
                    to: user_data.mail,
                    subject: "网站密码找回",
                    text: "网站密码找回",
                    html: `访问链接找回(5分钟内有效):<p>http://localhost:3000/find?token=${token}</p>`,
                })
                solve({ code: 1 })
            } else solve({ code: 0 })
        })
    },
    //用户账号找回
    async check_find(token) {
        return new Promise(async (solve, reject) => {
            let flag = this.check_token(token)
            if (flag) {
                let { user, pass } = flag
                db.execute('update t_user set pass = ? where user = ? or mail = ?', [pass, user, user], (err, result) => { })
                solve({ code: 1 })
            } else solve({ code: 0 })

        })
    },
    //设置轮播图
    async set_swiper(imgname) {
        return new Promise((solve, reject) => {
            db.execute('insert into t_swiper(img) value(?)', [imgname], (err, result) => {
                if (result) solve(1)
                else if (err) solve(0)
            })
        })
    },
    //获取所有员工
    async get_staff() {
        return new Promise((solve, reject) => {
            db.execute('select * from t_staff order by id desc', (err, result) => {
                if (result) {
                    result = this.filter_time(result)
                    solve(result)
                }
            })
        })
    },
    //获取用户账单
    async get_bill(uid) {
        return new Promise((solve, reject) => {
            db.execute('select * from t_bill where uid = ? order by id desc', [uid], (err, result) => {
                if (result) {
                    result = this.filter_time(result)
                    solve(result)
                }
            })
        })
    },
    //获取所有用户
    async get_all_user() {
        return new Promise((solve, reject) => {
            db.execute('select * from t_user order by id desc', (err, result) => {
                if (result) {
                    result = this.filter_time(result)
                    solve(result)
                }
            })
        })
    },
    //获取所有食物
    async get_food() {
        return new Promise((solve, reject) => {
            db.execute('select * from t_food order by id desc', (err, result) => {
                if (result) {
                    result = this.filter_time(result)
                    solve(result)
                }
            })
        })
    },
    //获取特定食物
    async get_id_food(id) {
        return new Promise((solve, reject) => {
            db.execute('select * from t_food where id  = ?', [id], (err, result) => {
                if (result) {
                    result = this.filter_time(result)
                    result[0].price = parseFloat(result[0].price)
                    solve(result[0])
                }
            })
        })
    },
    //获取特定用户
    async get_id_user(id) {
        return new Promise((solve, reject) => {
            db.execute('select * from t_user where id  = ?', [id], (err, result) => {
                if (result) {
                    result = this.filter_time(result)
                    result[0].price = parseFloat(result[0].price)
                    solve(result[0])
                }
            })
        })
    },
    //获取特定用户
    async get_user_user(user) {
        return new Promise((solve, reject) => {
            db.execute('select * from t_user where user  = ?', [user], (err, result) => {
                if (result) {
                    result[0].price = parseFloat(result[0].price)
                    solve(result[0])
                }
            })
        })
    },
    //验证管理员密码
    async check_old_pass(info) {
        let { id, old_pass } = info
        return new Promise((solve, reject) => {
            db.execute('select * from t_admin where id = ? and pass = ?', [id, old_pass], (err, result) => {
                if (result.length) solve(1)
                else solve(0)
            })
        })

    },
    //修改管理员账号
    async set_account(info) {
        return new Promise(async (solve, reject) => {
            let { admin_id, user, mail, new_pass } = info
            db.execute('update admin set user=?,mail=?,pass=? where id=?', [user, mail, new_pass, admin_id], (err, result) => {
                if (err) solve(0)
                else solve(1)
            })
        })
    },
    //搜索员工
    async search_staff(text) {
        return new Promise(async (solve, reject) => {
            db.execute(`select * from t_staff where name like '%${text}%' or sort like '%${text}%' order by id desc`, (err, result) => {
                solve(result)
            })
        })
    },
    //搜索用户
    async search_user(text) {
        return new Promise(async (solve, reject) => {
            db.execute(`select * from t_user where user like '%${text}%' or pass like '%${text}%' or mail like '%${text}%' or id like '%${text}%' order by id desc`, (err, result) => {
                solve(result)
            })
        })
    },
    //添加食物
    async add_food(data) {
        let { name, detail, price, localtion, introduce, img } = data
        return new Promise(async (solve, reject) => {
            db.execute("insert into food(name,detail,price,localtion,introduce,img) value(?,?,?,?,?,?)", [name, detail, price, localtion, introduce, img], (err, result) => {
                solve(result)
            })
        })
    },
    //支付功能
    async alipay(type, info) {
        let data = null;
        if (type == 'pay') {
            data = alipaySdk.exec("alipay.trade.precreate", {
                bizContent: {
                    out_trade_no: "yumao_" + Math.ceil(Math.random() * 100000000000),
                    total_amount: info.price,
                    subject: "一颗大白菜",
                },
            });
        } else if (type == 'query') {
            data = alipaySdk.exec("alipay.trade.query", {
                bizContent: {
                    out_trade_no: info.trade,
                },
            });
        }
        return data
    },
    //订单操作
    async add_trade(type, info) {
        //0默认无评价 1表示已评价
        db.execute('insert into t_trade(fid,uid,user_name,out_trade_on,food_name,food_price,food_localtion,estimate,status) value(?,?,?,?,?,?,?,0,-1)', [info.fid, info.uid, info.user_name, info.out_trade_no, info.name, info.price, info.localtion])
        return 1
    },
    //操作用户金额
    async set_user_price(type, uid, price) {
        price = parseFloat(price)
        let user = await this.get_id_user(uid)
        if (type == 'add') {
            let total = user.price + price
            db.execute('update t_user set price = ? where id = ? ', [total, uid])
        } else if (type == 'remove') {
            let total = user.price - price
            if (total < 0) total = 0.00
            db.execute('update t_user set price = ? where id = ? ', [total, uid])
        } else if (type == 'reset') {
            if (price < 0) return 1
            db.execute('update t_user set price = ? where id = ? ', [price, uid])
        }
        return 1
    },
    //操作用户账单
    async set_user_bill(obj) {
        let { uid, fid, type, old_price, new_price, change_price } = obj
        db.execute('insert into t_bill(uid,fid,type,old_price,new_price,change_price,time) value(?,?,?,?,?,?,now())', [uid, fid, type, old_price, new_price, change_price]);
    },
    //获取用户账单
    async get_user_bill(uid) {
        return new Promise((solve, reject) => {
            db.execute('select * from t_bill where uid = ? order by id desc', [uid], (e, r) => {
                if (r) {
                    r = this.filter_time(r)
                    r.forEach((v) => {
                        v.old_price = parseFloat(v.old_price)
                        v.new_price = parseFloat(v.new_price)
                        v.change_price = parseFloat(v.change_price)
                    })
                    solve(r)
                }
            })
        })
    },
    //增加订单凭证
    async add_out_trade_on(out_trade_on) {
        let data = await this.get_out_trade_on(out_trade_on)
        if (data) return 0
        db.execute('insert into t_evidence(out_trade_on) value(?)', [out_trade_on])
        return 1
    },
    //获取订单凭证
    async get_out_trade_on(out_trade_no) {
        return new Promise((solve, reject) => {
            db.execute('select * from  t_evidence  where out_trade_on = ? ', [out_trade_no], (e, r) => {
                if (r) solve(r[0])
            })
        })
    },
    //更新用户信息
    async update_user_data(uid) {
        let data = await this.get_id_user(uid)
        let msg = { token: '', data: '' }
        msg.token = this.set_token({ power: 'user', id: data.id, user: data.user, name: data.name })
        msg.data = data
        return msg
    },
    //获取用户所有订单
    async get_user_trade(uid, index = 200) {
        if (index == 0)
            return new Promise((solve, reject) => {
                db.execute('select * from t_trade where uid = ? and estimate = 0 order by id desc', [uid], (err, result) => {
                    if (result.length) {
                        result = this.filter_time(result)
                        result.forEach((v) => {
                            v.method = v.out_trade_on == "balance_pay" ? "余额购买" : "扫码购买";
                        });
                    }
                    solve(result)
                })
            })
        else if (index == -1)
            return new Promise((solve, reject) => {
                db.execute('select * from t_trade where uid = ? and estimate = -1 or estimate = -2 order by id desc', [uid], (err, result) => {
                    if (result.length) {
                        result = this.filter_time(result)
                        result.forEach((v) => {
                            v.method = v.out_trade_on == "balance_pay" ? "余额购买" : "扫码购买";
                        });
                    }
                    solve(result)
                })
            })
        else if (index == 1)
            return new Promise((solve, reject) => {
                db.execute('select * from t_trade where uid = ? and estimate = 1 order by id desc', [uid], (err, result) => {
                    if (result.length) {
                        result = this.filter_time(result)
                        result.forEach((v) => {
                            v.method = v.out_trade_on == "balance_pay" ? "余额购买" : "扫码购买";
                        });
                    }
                    solve(result)
                })
            })
        else if (index == 200)
            return new Promise((solve, reject) => {
                db.execute('select * from t_trade where uid = ? order by id desc', [uid], (err, result) => {
                    if (result.length) {
                        result = this.filter_time(result)
                        result.forEach((v) => {
                            v.method = v.out_trade_on == "balance_pay" ? "余额购买" : "扫码购买";
                        });
                    }
                    solve(result)
                })
            })
    },
    //修改用户信息
    async set_table_filed(table, filed, value, id) {
        db.execute(`update ${table} set ${filed} = '${value}' where id = ${id}`, (err, result) => {
            if (err) console.log(err);
        })
    },
    //获取乱七八糟
    async get_mess(title) {
        return new Promise(async (s, r) => {
            db.execute("select * from t_mess where title = ?", [title], (err, result) => {
                result = this.filter_time(result)
                s(result[0])
            })
        })
    },
    //过滤时间
    filter_time(data) {
        if (!Array.isArray(data)) return new Error('非数组数据类型！')
        data.forEach((v) => {
            v.time = moment(v.time).format('YYYY-MM-DD HH:mm:ss')
        })
        return data
    },
    //获取菜品评价
    async get_estimate(uid, trade_id) {
        return new Promise((resolve, reject) => {
            db.execute('select * from t_estimate where uid = ? and trade_id = ?', [uid, trade_id], (err, result) => {
                if (result) resolve(result)
            })
        })
    },
    //发送菜品评价
    async send_estimate(obj, address) {
        let { food, text } = obj
        let { uid, fid, id } = food
        let trade_id = id
        let flag = false
        let data = await this.get_estimate(uid, trade_id)
        if (!data.length) {
            db.execute('update t_trade set estimate=1,estimate_content=?,ip=? where id = ?', [text, address, trade_id])
            db.execute('insert into t_estimate(uid,fid,trade_id,content,love,status,time,ip) value(?,?,?,?,0,1,now(),?)', [uid, fid, trade_id, text, address], (err, result) => {
                if (err) console.log(err);
            });
            flag = true
        }
        return flag
    },
    //获取指定订单评价
    async get_list_estimate(fid) {
        return new Promise((solve, reject) => {
            db.execute('select * from t_trade where fid = ? and estimate = 1 order by id desc', [fid], (e, r) => {
                if (r) {
                    r = this.filter_time(r)
                    solve(r)
                }
            })
        })
    },
    //获取所有已经的评价
    async get_all_estimate() {
        return new Promise((solve, reject) => {
            db.execute('select * from t_trade where estimate != 0 order by id desc', (e, r) => {
                if (r) {
                    r = this.filter_time(r)
                    solve(r)
                }
            })
        })
    },
    //搜索评价
    async search_estimate(text) {
        return new Promise((solve, reject) => {
            db.execute(`select * from t_trade where estimate != 0 and (food_name like '%${text}%' or estimate_content like '%${text}%' or uid like '%${text}%') order by id desc`, (e, r) => {
                if (r) {
                    r = this.filter_time(r)
                    solve(r)
                }
            })
        })
    },
    //获取全部订单
    async get_all_trade(text) {
        return new Promise((solve, reject) => {
            db.execute(`select * from t_trade order by id desc`, (e, r) => {
                if (r) {
                    r = this.filter_time(r)
                    solve(r)
                }
            })
        })
    },
    //管理员搜索某个订单
    async search_trade(text) {
        return new Promise((solve, reject) => {
            db.execute(`select * from t_trade where food_name like '%${text}%' or food_localtion like '%${text}%' or user_name like '%${text}%' or time like '%${text}%' order by id desc `, (e, r) => {
                if (r) {
                    r = this.filter_time(r)
                    solve(r)
                }
            })
        })
    },
    //添加日志
    async add_log(obj) {
        let { uid, aid, bid, content, ip, device } = obj
        db.execute("insert into t_log(uid,aid,bid,content,ip,device,time) value(?,?,?,?,?,?,now())", [uid, aid, bid, content, ip, device])
    },
    //获取日志
    async get_log(type, id) {
        return new Promise((solve, reject) => {
            if (type == 'admin')
                db.execute('select * from t_log where aid = ? order by id desc', [id], (err, r) => {
                    if (r) {
                        r = this.filter_time(r)
                        solve(r)
                    }
                })
            else
                db.execute('select * from t_log where uid = ? order by id desc', [id], (err, r) => {
                    if (r) {
                        r = this.filter_time(r)
                        solve(r)
                    }
                })
        })
    },
    //搜索日志
    async search_log(type, id, text) {
        return new Promise((solve, reject) => {
            if (type == 'admin')
                db.execute(`select * from t_log where aid = ${id} and (content like '%${text}%' or ip like '%${text}%' or device like '%${text}%' or time like '%${text}%') order by id desc`, [id], (err, r) => {
                    if (r) {
                        r = this.filter_time(r)
                        solve(r)
                    }
                })
            else
                db.execute(`select * from t_log where uid = ${id} and (content like '%${text}%' or ip like '%${text}%' or device like '%${text}%' or time like '%${text}%') order by id desc`, [id], (err, r) => {
                    if (r) {
                        r = this.filter_time(r)
                        solve(r)
                    }
                })
        })
    },
    //IP转化成地址
    async get_ip_address(ip) {
        let dbPath = other_dest + 'ip2region.xdb'
        let vectorIndex = Searcher.loadVectorIndexFromFile(dbPath)
        let searcher = Searcher.newWithVectorIndex(dbPath, vectorIndex)
        let data = await searcher.search(ip)
        return data.region
    }
    ,
    //获取商家信息
    async get_business() {
        return new Promise((solve, reject) => {
            db.execute('select * from t_business order by id desc', (err, r) => {
                if (r) {
                    r = this.filter_time(r)
                    solve(r)
                }
            })
        })
    },
    //搜索商家信息
    async search_business(text) {
        return new Promise((solve, reject) => {
            db.execute(`select * from t_business where name like '%${text}%' or user like '%${text}%' or tel like '%${text}%' order by id desc`, (e, r) => {
                if (r) {
                    r = this.filter_time(r)
                    solve(r)
                }
            })
        })
    },
    //获取商家订单
    async get_business_trade(name, index) {
        if (index == 1) {
            return new Promise((solve, reject) => {
                db.execute("select * from t_trade where status = 1 order by id desc", (e, r) => {
                    if (r) {
                        r = this.filter_time(r)
                        solve(r)
                    }
                })
            })
        }
        else if (index == -1)
            return new Promise((solve, reject) => {
                db.execute("select * from t_trade where status = -1 order by id desc", (e, r) => {
                    if (r) {
                        r = this.filter_time(r)
                        solve(r)
                    }
                })
            })
        else
            return new Promise((solve, reject) => {
                db.execute('select * from t_trade where food_localtion = ? order by id desc', [name], (e, r) => {
                    if (r) {
                        r = this.filter_time(r)
                        solve(r)
                    }
                })
            })
    },
    //搜索商家订单
    async business_search_order(name, text) {
        return new Promise((solve, reject) => {
            //危险操作
            db.execute(`select * from t_trade where food_localtion = '${name}' and (user_name like '%${text}%' or time like '%${text}%' or food_name like '%${text}%' or estimate_content like '%${text}%') order by id desc`, (err, result) => {
                if (result.length) result = this.filter_time(result)
                solve(result);
            })
        })
    },
    //获取商家食物
    async get_business_food(name) {
        return new Promise((solve, reject) => {
            db.execute("select * from t_food where localtion = ? order by id desc", [name], (err, result) => {
                if (result.length) result = this.filter_time(result)
                solve(result);
            })
        })
    },
    //搜索商家食物
    async search_business_food(name, text) {
        return new Promise((solve, reject) => {
            db.execute(`select * from t_food where localtion = '${name}' and name like '%${text}%' or detail like '%${text}%' or introduce like '%${text}%' order by id desc`, (err, result) => {
                if (result.length) result = this.filter_time(result)
                solve(result);
            })
        })
    },
    //验证商家信息
    async check_business_info(type, obj) {
        if (type == 'user') {
            let { user, id } = obj
            return new Promise((solve, reject) => {
                db.execute("select * from t_business where id != ? and user = ?", [id, user], (err, result) => {
                    if (result.length) solve(0);
                    else solve(1)
                })
            })
        } else if (type == 'pass') {
            let { old_pass, id } = obj
            return new Promise((solve, reject) => {
                db.execute("select * from t_business where id = ? and pass = ?", [id, old_pass], (err, result) => {
                    if (result.length) solve(1);
                    else solve(0)
                })
            })
        }
        else if (type == 'admin_check_name') {  //验证昵称
            let { name } = obj
            return new Promise((solve, reject) => {
                db.execute("select * from t_business where name = ?", [name], (err, result) => {
                    if (result.length) solve(1);
                    else solve(0)
                })
            })
        }
        else if (type == 'admin_check_user') { //验证用户
            let { user } = obj
            return new Promise((solve, reject) => {
                db.execute("select * from t_business where user = ?", [user], (err, result) => {
                    if (result.length) solve(1);
                    else solve(0)
                })
            })
        }
        else if (type == 'admin_save_name') { //验证用户
            let { name, id } = obj
            return new Promise((solve, reject) => {
                db.execute("select * from t_business where id != ? and name = ?", [id, name], (err, result) => {
                    if (result.length) solve(1);
                    else solve(0)
                })
            })
        }
        else if (type == 'admin_save_user') { //验证用户
            let { user, id } = obj
            return new Promise((solve, reject) => {
                db.execute("select * from t_business where id != ? and user = ?", [id, user], (err, result) => {
                    if (result.length) solve(1);
                    else solve(0)
                })
            })
        }
    },
    //获取商家日志
    async get_business_log(bid) {
        return new Promise((solve, reject) => {
            db.execute('select * from t_log where bid = ? order by id desc', [bid], (e, r) => {
                if (r) r = this.filter_time(r)
                solve(r)
            })
        })
    },
    //搜索商家日志
    async search_business_log(bid, text) {
        return new Promise((solve, reject) => {
            db.execute(`select * from t_log where bid = '${bid}' and (content like '%${text}%' or ip like '%${text}%' or device like '%${text}%' or time like '%${text}%') order by id desc`, (e, r) => {
                if (r) r = this.filter_time(r)
                solve(r)
            })
        })
    },
    //管理员管理订单
    async admin_filter_trade(type) {
        if (type == '订单已完成')
            return new Promise((solve, reject) => {
                db.execute(`select * from t_trade where status = 1 order by id desc`, (e, r) => {
                    if (r) r = this.filter_time(r)
                    solve(r)
                })
            })
        else if (type == '订单未完成')
            return new Promise((solve, reject) => {
                db.execute(`select * from t_trade where status = -1 order by id desc`, (e, r) => {
                    if (r) r = this.filter_time(r)
                    solve(r)
                })
            })
        else if (type == '评论已发布')
            return new Promise((solve, reject) => {
                db.execute(`select * from t_trade where estimate = 1 order by id desc`, (e, r) => {
                    if (r) r = this.filter_time(r)
                    solve(r)
                })
            })
        else if (type == '评论未发布')
            return new Promise((solve, reject) => {
                db.execute(`select * from t_trade where estimate = 0 order by id desc`, (e, r) => {
                    if (r) r = this.filter_time(r)
                    solve(r)
                })
            })
        else if (type == '取消检索') 
        return new Promise((solve, reject) => {
            db.execute(`select * from t_trade order by id desc`, (e, r) => {
                if (r) r = this.filter_time(r)
                solve(r)
            })
        })
    },



}