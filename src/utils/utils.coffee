Promise = require('promise-polyfill').default
uuid_1 = require 'uuid'
v5_1 = require 'uuid/v5'
base58_1 = require '@/base58'
qrcode_1 = require 'qrcode'
qrDataToDataUrl = (qrData) ->
  new Promise (resolve, reject) ->
    canvas = document.createElement('canvas')
    qrcode_1.toCanvas canvas, qrData, (error) ->
      if error
        console.error error
        reject error
      dataUrl = canvas.toDataURL()
      resolve dataUrl
isInViewport = (element) ->
  distance = element.getBoundingClientRect()
  viewportHeight = window.innerHeight or document.documentElement.clientHeight
  viewportWidth = window.innerWidth or document.documentElement.clientWidth
  hiddenHeight = distance.height * 0.8
  hiddenWidth = distance.width * 0.8
  distance.top >= 0 - hiddenHeight and distance.left >= 0 - hiddenWidth and distance.bottom <= viewportHeight + hiddenHeight and distance.right <= viewportWidth + hiddenWidth

makeBranchQueryData = (storyName, secretKey) ->
  branch_key: 'key_live_haoXB4nBJ0AHZj0o1OFOGjafzFa8nQOG'
  channel: 'sms'
  feature: 'sharing'
  data:
    '~creation_source': 3
    '$ios_url': 'https://itunes.apple.com/us/app/gobi-send-snaps-in-groups!/id1025344825?mt=8'
    $desktop_url: 'http://www.gobiapp.com'
    $identity_id: '624199976595486526'
    $og_image_url: 'https://gobiapp.com/img/gobi_blue.png'
    '$og_description': 'Create videos in this story :)'
    $canonical_identifier: 'group/' + storyName
    $og_title: 'Gobi'
    $one_time_use: false
    $publicly_indexable: false
    action: 'groupAdd'
    username: ''
    group: storyName
    id: 'auto-' + secretKey
    source: 'Gobi-Web-Integration'
makeViewKey = (secretKey) ->
  execd = secretKey.match '^([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})$'
  if !execd
    throw new Error 'secretKey malformed'
  uuidNodePart = execd[5]
  uuidNodePartInt = parseInt uuidNodePart, 0x10
  nodeInBase58 = base58_1.int_to_base58 uuidNodePartInt
  node8Characters = nodeInBase58.slice -8
  node8Characters

makeRandomStorySecretKey = ->
  gobiUuid = v5_1 'gobistories.co', v5_1.DNS
  storySecretKey = uuid_1.v4(gobiUuid)
  storySecretKey

getBranchLink = (data) ->
  url = 'https://api2.branch.io/v1/url'
  fetching = fetch(url,
    method: 'POST'
    mode: 'cors'
    headers: 'Content-Type': 'application/json'
    body: JSON.stringify(data)).then((response) ->
    response.json()
  )
  fetching

addPrefixToClassName = (list, prefix) ->
  max = list.length
  elem = undefined
  i = 0
  while i < max
    elem = list[i]
    if not list[i] instanceof SVGElement
      elem.className = prefix + elem.className
    i++
  return

returnHighestZIndex = ->
  elems = document.body.querySelectorAll('*')
  maxZIndex = 1
  currentZIndex = 0
  i = elems.length
  while i--
    currentZIndex = Number(window.getComputedStyle(elems[i]).zIndex)
    if maxZIndex < currentZIndex
      maxZIndex = currentZIndex
  maxZIndex

fetchAvatarAndTitleGivenViewKey = (viewKey) ->
  url = 'https://live.gobiapp.com/api/v4/story/by_view_key/' + viewKey
  inner url, viewKey

fetchAvatarAndTitleGivenStoryId = (storyId) ->
  url = 'https://live.gobiapp.com/projector/player/stories/' + storyId
  inner url, storyId

inner = (url, key_or_id) ->
  new Promise (resolve, reject) ->
    xhr = new XMLHttpRequest
    xhr.open 'GET', url, true
    xhr.send()
    xhr.onload = ->
      if @status < 400
        response = JSON.parse(@responseText)
        if response and response.videos and response.videos[0]
          src = response.videos[0].poster
          title = response.title or response.videos[0].title
          resolve
            src: src
            title: title
        else
          reject Error('No video[0] for story ' + url + ' -- ' + xhr.statusText)
      else
        reject Error('Error loading info for story ' + url + ' -- ' + xhr.statusText)
    xhr.onerror = ->
      reject Error('Error xhr-ing info for url ' + url)

module.exports.scrollDisabler =
  scrollTop: 0
  bodyOverflow: ''
  htmlOverflow: ''
  disable: ->
    if @isIOS then @IOSDisable() else @classicDisable()
  enable: ->
    if @isIOS then @IOSEnable() else @classicEnable()
  classicDisable: ->
    @bodyOverflow = document.body.style.overflow
    @htmlOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
  classicEnable: ->
    document.documentElement.style.overflow = @htmlOverflow
    document.body.style.overflow = @bodyOverflow
  IOSEnable: ->
    document.documentElement.classList.remove 'disabled-scroll'
    document.body.classList.remove 'disabled-scroll'
    window.scrollTo 0, @scrollTop
  IOSDisable: ->
    @scrollTop = window.pageYOffset
    document.documentElement.classList.add 'disabled-scroll'
    document.body.classList.add 'disabled-scroll'
  isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent)

module.exports.fetchAvatarAndTitleGivenViewKey = fetchAvatarAndTitleGivenViewKey
module.exports.fetchAvatarAndTitleGivenStoryId = fetchAvatarAndTitleGivenStoryId
module.exports.qrDataToDataUrl = qrDataToDataUrl
module.exports.makeBranchQueryData = makeBranchQueryData
module.exports.makeViewKey = makeViewKey
module.exports.makeRandomStorySecretKey = makeRandomStorySecretKey
module.exports.getBranchLink = getBranchLink
module.exports.addPrefixToClassName = addPrefixToClassName
module.exports.returnHighestZIndex = returnHighestZIndex
module.exports.isInViewport = isInViewport
