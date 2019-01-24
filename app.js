const http = require('http')
const qs = require('querystring')
const  newidsAuth  = require('./newids')
const chalk = require('chalk')
const moment = require('moment')
http.createServer((request, response) => {
    let requestBody = Buffer.from('') 
    request.on('data', (chunk) => {
        requestBody += chunk
    })
    request.on('end', ()=>{
        requestBody = qs.parse(requestBody.toString('utf8'))
        newidsAuth({cardnum:requestBody.cardnum, password:requestBody.password}).then((res) => {
            console.log(`${moment()} ${chalk.yellow.bold(requestBody.cardnum)} ${res.success ? chalk.bgGreen.bold('认证成功'):chalk.bgRed.bold('认证失败')}`)
            return res
        }).catch((e) => {
            let responseBody = {
                err: true,
                msg: e.message
            }
            console.log(e)
            return responseBody
        }).then((responseBody) => {
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(responseBody));
        })
    })
    
}).listen(4003);
