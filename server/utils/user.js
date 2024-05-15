import config from "../yumao/config"
import multer from 'multer'
import AlipaySdk from "alipay-sdk";
import moment from "moment";
const alipaySdk = new AlipaySdk({
    appId: config.alipay.id,
    privateKey: config.alipay.privateKey,
    alipayPublicKey: config.alipay.publicKey
});

let dest = ''
if (process.env.NODE_ENV == 'development') dest = './public/images';
else dest = '.output/public/images';

let upload = multer({
    dest, //这个目录相对于项目文件中node_modules 
    limits: {
        files: 9,
        fields: 10,
        fileSize: 10.5 * 1024 * 1024
    }
}).array('files', 9)

let { db, token_secret, mail } = config
let _mail = mail


export default {
    async search_order(uid, text) {
        return new Promise((solve, reject) => {
            //危险操作
            db.execute(`select * from t_trade where uid = ${uid} and food_name like '%${text}%' or food_name like '%${text}%' or food_price like '%${text}%' or food_localtion like '%${text}%' or time like '%${text}%' order by id desc`, (err, result) => {
                if (result.length) {
                    result.forEach((v) => {
                        v.method = v.out_trade_on == "balance_pay" ? "余额购买" : "扫码购买";
                    });
                    result = this.filter_time(result)
                    solve(result);
                }
            })
        })
    },
    //过滤时间
    filter_time(data) {
        if (!Array.isArray(data)) return new Error('非数组数据类型！')
        if (!data.length) return
        data.forEach((v) => {
            v.time = moment(v.time).format('YYYY-MM-DD HH:mm:ss')
        })
        return data
    }
}