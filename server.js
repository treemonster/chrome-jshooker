const fs=require('fs')
const url=require('url')
const querystring=require('querystring')
try{
  fs.mkdirSync(__dirname+'/data')
}catch(e){}
function md5(str) {
  return require('crypto').createHash('md5').update(str).digest('hex')
}
require('http').createServer((req, res)=>{
  let c=unescape(unescape(req.url).replace(/^.*?\?url=.*?\?url=/, ''))
  let u=`${c}?chrome-url-focus`, d=`// ${u}?\r\nconsole.log('hooked')\r\n`
  let f=__dirname+'/data/'+c.replace(/^https*\:\/\/|\?.*/g, '').replace(/[^a-z\d\.]/ig, '_').replace(/\.[^\.]+$/, _=>'.'+md5(u)+_)
  if(!fs.existsSync(f) || fs.readFileSync(f, 'utf-8')===d) {
    fs.writeFileSync(f, d)
    res.writeHead(302, {'Location': u})
    res.end()
  }else res.end(fs.readFileSync(f, 'utf-8'))
}).listen(23456)
