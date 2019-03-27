chrome.webRequest.onBeforeRequest.addListener(({url})=>(
  (
    url.match(/^https*\:\/\/.*?(\.js|\.css)(\?|$|#)/i) &&
    !url.match(/chrome-url-focus/)
  )? {
    redirectUrl: 'http://127.0.0.1:23456/?url='+escape(url),
  }: {}
),{urls: ["<all_urls>"]},["blocking"])
