addCss = (filename) ->
  head = document.head
  link = document.createElement 'link'
  link.type = 'text/css'
  link.rel = 'stylesheet'
  link.href = filename
  head.appendChild link

if window.location.protocol.startsWith 'file'
  addCss '../dist/index.css'
else
  packageJson = require '../package.json'
  v = packageJson.version
  console.log '%cGobi-Web-Integration v' + v, 'font-weight:bold; font-size: 16px'
  addCss 'https://unpkg.com/@gobistories/gobi-web-integration@' + v + '/dist/index.css'

require './styles'
Player = require '@/Player'
Bubbles = require '@/Bubbles'

module.exports.Player = Player
module.exports.SinglePlayer = Player
module.exports.Bubbles = Bubbles

utils = require '@/utils/utils'
module.exports.makeNewStory = ->
  secretKey = utils.makeRandomStorySecretKey()
  viewKey = utils.makeViewKey secretKey
  { secretKey: secretKey, viewKey: viewKey }
