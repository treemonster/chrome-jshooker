const testReg=(str)=>{
  if(!str) return false
  try{
    let s=str,i='';
    str.replace(/^\/(.+?)\/([igu]*)$/,(_,a,b)=>{
      s=a; i=b
    })
    return new RegExp(s,i)
  }catch(e){
    return false
  }
}

if(location.href.match(/cwg\.html$/)){

  let add=(keywords,content,checked)=>{
    $('#contain').append(`
      <div style="border:1px solid #ccc;margin:10px 5px;">
        <button remove>移除</button>
        <label style="float: right; margin-right: 10px;">
          <input regmatch type=checkbox ${checked&&'checked'}>
          正则匹配
          <b style='margin:0 4px;' msg></b>
        </label>
        <input keywords placeholder="javascript文件路径包含的关键字"
          value="${(keywords||'').replace(/</g,'&lt;')}"
          style="width:100%;margin-bottom:3px;">
        <textarea content style="width:100%;min-height:200px;" placeholder="用来替换的javascript内容">${(content||'').replace(/</g,'&lt;')}</textarea>
      </div>
    `)
  }
  let update=()=>{
    let datas=[];
    $('#contain>div').each(function(){
      const t=$(this),o={
        keywords: t.find('[keywords]').val(),
        content: t.find('[content]').val(),
        regmatch: t.find('[regmatch]')[0].checked,
      },z=t.find('[msg]');
      datas.push(o)

      if(!o.regmatch) return z.html('');

      let reg=testReg(o.keywords)
      reg?
        z.html(`<font color=green>${''+reg}</font>`):
        z.html(`<font color=red>语法错误</font>`)
    })
    localStorage.setItem("datas",JSON.stringify(datas))
  };

  document.write(`
    <button id="addbtn">增加规则</button>
    <div id="contain" style="width:400px;min-height:10px;"></div>
  `);

  $('#addbtn').on('click',()=>add())

  document.addEventListener('DOMContentLoaded', ()=>{
    try{
      JSON.parse(localStorage.getItem('datas')).map((x)=>{
        add(x.keywords,x.content,x.regmatch)
      })
    }catch(e){}
    update()

    $(document)
      .on('keyup','textarea,input',update)
      .on('change','[type=checkbox]',update)
      .on('click','[remove]',function(){
      switch(this.c){
        case undefined: case 0:
        clearTimeout(this.cx)
        this.c=1;
        $(this).css('color','#f00')
        this.cx=setTimeout(()=>{
          this.c=0;
          $(this).css('color','#000')
        },2000)
        break;

        case 1:
        $(this).parent().remove()
        update()
        break;

      }
    })
  });

}else{
  chrome.webRequest.onBeforeRequest.addListener(function(details){
    try{
      return JSON.parse(localStorage.getItem('datas')).reduce((a,x)=>{
        return (x.regmatch?
          details.url.match(testReg(x.keywords)):
          details.url.indexOf(x.keywords)>-1
        ) && !details.url.match(/^chrome\-ext/i)?
          {redirectUrl:`data:text/javascript,eval(unescape('${escape(escape(x.content))}'))`}:
          a;
      },{})
    }catch(e){}
    return{}
  },{urls: ["<all_urls>"]},["blocking"]);

}
