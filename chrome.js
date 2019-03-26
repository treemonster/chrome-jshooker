chrome.webRequest.onBeforeRequest.addListener(function(details){
  return (details.url.match(/^https*\:\/\/.*?\.js\b/) && !details.url.match(/chrome-url-focus/))? {
    redirectUrl: 'http://127.0.0.1:23456/?url='+escape(details.url)
  }: {}
},{urls: ["<all_urls>"]},["blocking"])
