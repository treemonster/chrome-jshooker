const fs=require('fs')
const url=require('url')
const querystring=require('querystring')
try{
  fs.mkdirSync(__dirname+'/data')
}catch(e){}

require('http').createServer((req, res)=>{
  let c=unescape(unescape(req.url).replace(/^.*?\?url=.*?\?url=/, ''))
  let f=__dirname+'/data/'+c.replace(/^https*\:\/\/|\?.*/g, '').replace(/[^a-z\d\.]/ig, '_')
  let u=`${c}?chrome-url-focus`, d=`// ${u}?\r\nconsole.log('hooked')\r\n`
  if(!fs.existsSync(f) || fs.readFileSync(f, 'utf-8')===d) {
    fs.writeFileSync(f, d)
    res.writeHead(302, {'Location': u})
    res.end()
  }else res.end(fs.readFileSync(f, 'utf-8'))
}).listen(23456)
