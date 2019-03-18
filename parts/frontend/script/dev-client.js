/* eslint-disable */
var hotClient = require('webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true')

hotClient.subscribe(function (event) {
  console.log(event)
  if (event.action === 'reload') {
      console.log('reload event')
      window.location.reload()
  } else if (event.action === 'css-file-changed') {
      console.log('css-file-changed event')
      Array.from(document.head.querySelectorAll('link')).forEach(link => {
        if (link.type !== 'text/css') return
        let href = link.href
        document.head.removeChild(link)
        const newlink = document.createElement('link');
        newlink.href = href;
        document.head.appendChild(newlink)
      }
     );
  }
})
