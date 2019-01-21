const axios = require('axios')

const getCaptcha = async()=> {
    let now = new Date().getTime()
    let res = await axios.get('http://newxk.urp.seu.edu.cn/xsxkapp/sys/xsxkapp/student/4/vcode.do',{timestamp:now})
    let vtoken = res.data.data.token // vtoken后面登录的时候还要用
    console.log(vtoken)
    let res2 = await axios.get('http://newxk.urp.seu.edu.cn/xsxkapp/sys/xsxkapp/student/vcode/image.do?vtoken='+vtoken)
    console.log(res2)
}

getCaptcha()