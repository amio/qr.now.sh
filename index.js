const fs = require('fs')
const qrec = require('qr-encoder')
const micro = require('micro')

function genHTML (qr) {
  let html = ''
  qr.forEach(line => {
    line.forEach(dot => {
      html += (dot === 1 ? '<em class="b"></em>':'<em class="w"></em>')
    })
    html +=('<br />')
  })
  return html
}

const readme = fs.readFileSync('./README.md', 'utf8')

module.exports = (req, res) => {
  if (req.url === '/') {
    return micro.send(res, 200, readme)
  }

  const text = req.url.replace('/', '')
  const qr = qrec.encode(text, 1)
  const html = `
    <style>
      body { font: 18px/21px Courier New; display: flex; align-items: center; justify-content: center }
      div { white-space: pre }
      em { display: inline-block; width: 16px; height: 16px }
      .b { background-color: black }
    </style>
    <div>${genHTML(qr)}</div>
  `
  micro.send(res, 200, html)
}
