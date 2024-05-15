


// vue文件可用
export let config = () => {
    let a = 127
    if (process.env.NODE_ENV == 'development') a = 127
    else a = 'hl.sb'
    return {
        a,
    }
}