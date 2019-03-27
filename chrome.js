chrome.webRequest.onBeforeRequest.addListener(function({url, type}) {
  let hook=url.match(/^https*\:\/\/.*?(\.js|\.css)(\?|$|#)/i) && !url.match(/chrome-url-focus|23456/)
  if(!hook) return {}
  return {redirectUrl: 'http://127.0.0.1:23456/?url='+escape(url)}
}, {urls: ["<all_urls>"]},["blocking"])
