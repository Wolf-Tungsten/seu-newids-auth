const axios = require('axios')

const newidsAuth = async (username, password) => {
    let needCaptcha = await axios.get(`https://newids.seu.edu.cn/authserver/needCaptcha.html?username=${username}`)
    if (!needCaptcha.data) {
        let res1 = await axios.get('https://newids.seu.edu.cn/authserver/login?goto=http://my.seu.edu.cn/index.portal')
        let lt = (/name="lt" value="([A-Za-z0-9\-]+)"/g.exec(res1.data))[1]
        let cookie1 = res1.headers['set-cookie']
        cookie1 = cookie1[0]+';'+cookie1[1].split(';')[0]
        let formdata = `username=${username}&password=${password}&lt=${lt}&dllt=userNamePasswordLogin&execution=e1s1&_eventId=submit&rmShown=1`
        let res2 = await axios.post('https://newids.seu.edu.cn/authserver/login?goto=http://my.seu.edu.cn/index.portal', formdata, {
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': cookie1
            },
            validateStatus: function (status) {
                return status === 302 || status === 200; // 只有302是登陆成功
            },
            maxRedirects: 0
        })
        return res2.status === 302 ? 1 : 0
    } else {
        return -1
    }
}

module.exports = { newidsAuth }