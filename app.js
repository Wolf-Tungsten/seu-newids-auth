const http = require('http')
const qs = require('querystring')
const { newidsAuth } = require('./newids')

http.createServer((request, response) => {
    let requestBody = Buffer.from('') 
    request.on('data', (chunk) => {
        requestBody += chunk
    })
    request.on('end', ()=>{
        requestBody = qs.parse(requestBody.toString('utf8'))
        newidsAuth(requestBody.username, requestBody.password).then((code) => {
            let responseBody = { code }
            if (code === 1) {
                responseBody.msg = '统一身份认证成功'
                responseBody.success = true
            } else if (code === 0) {
                responseBody.msg = '一卡通或密码错误'
                responseBody.success = false
            } else if (code === -1) {
                responseBody.msg = '出于安全性考虑，本次登录被临时限制。请使用浏览器访问并重新登录校园信息门户（my.seu.edu.cn），消除验证码后再进行尝试。'
                responseBody.success = false
            }
            return responseBody
        }).catch((e) => {
            let responseBody = {
                err: true,
                msg: e.message
            }
            return responseBody
        }).then((responseBody) => {
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(responseBody));
        })
    })
    
}).listen(7902);