addCss = (filename) ->
  head = document.head
  link = document.createElement 'link'
  link.type = 'text/css'
  link.rel = 'stylesheet'
  link.href = filename
  head.appendChild link

packageJson = require '../package.json'
console.log 'Gobi-Web-Integration version', packageJson.version
v = packageJson.version
addCss "https://unpkg.com/@gobistories/gobi-web-integration@^#{v}/dist/index.css"

require './styles'
module.exports.Player = require '@/Player'
module.exports.Bubbles = require '@/Bubbles'

utils = require '@/utils/utils'
module.exports.makeNewStory = ->
  secretKey = utils.makeRandomStorySecretKey()
  viewKey = utils.makeViewKey secretKey
  { secretKey, viewKey }
