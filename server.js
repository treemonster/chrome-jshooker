const fs=require('fs')
const url=require('url')
const querystring=require('querystring')
try{
  fs.mkdirSync(__dirname+'/data')
}catch(e){}
function md5(str) {
  return require('crypto').createHash('md5').update(str).digest('hex')
}
function cut(str, a, b) {
  return str.replace(new RegExp('(^.{'+a+'}).*?(.{'+b+'}$)', 'g'), '$1...$2')
}
require('http').createServer((req, res)=>{
  let c=unescape(unescape(req.url).replace(/^.*?\?url=.*?\?url=/, ''))
  let u=`${c}#chrome-url-focus`, d=`// ${u}?\r\n// you can paste the formatted code here\r\n`
  let f=__dirname+'/data/'+c.replace(/^https*\:\/\/(.+?)\/.*?([^\/]+?)(?:\?.*|$)/g, (_, a, b)=>{
    return (a+'/'+md5(u)+'/'+cut(b, 15, 15)).replace(/[^a-z\d\.]/ig, '_')
  })
  if(!fs.existsSync(f) || fs.readFileSync(f, 'utf-8')===d) {
    fs.writeFileSync(f, d)
    res.writeHead(302, {'Location': u})
    res.end()
  }else res.end(fs.readFileSync(f, 'utf-8'))
}).listen(23456)
