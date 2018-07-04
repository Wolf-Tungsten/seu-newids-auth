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
                responseBody.msg = '用户名或密码错误'
                responseBody.success = false
            } else if (code === -1) {
                responseBody.msg = '安全保护，请前往信息门户界面登陆'
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