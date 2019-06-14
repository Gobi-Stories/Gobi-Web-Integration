'use strict'
Object.defineProperty exports, '__esModule', value: true
tslib_1 = require('tslib')
event_emitter_1 = tslib_1.__importDefault(require('@/utils/event-emitter'))
Player = do ->
  `var Player`

  Player = (options) ->
    _this = this
    @_defaultOptions =
      autoStart: false
      hideOverlay: false
      loop: false
      width: 0
      height: 0
      roundedCorners: true
      shadow: true
      checkViewPort: true
    @_eventEmitter = new (event_emitter_1.default)
    @on = @_eventEmitter.on.bind(@_eventEmitter)
    @off = @_eventEmitter.off.bind(@_eventEmitter)

    @_removeIsOnScreenChecker = ->

    @_removeIsOutOfScreenChecker = ->

    @_isOutOfScreenChecker = ->
      if !_this.isInViewport()
        _this.pause()
        _this._removeIsOutOfScreenChecker()
        _this._addIsOnScreenChecker()
      return

    @_isOnScreenChecker = ->
      if _this.isInViewport()
        _this.play()
        _this._removeIsOnScreenChecker()
        _this._addIsOutOfScreenChecker()
      return

    @_options = Object.assign({}, @_defaultOptions, options)
    @rootElement = @_createIframe()
    if @_options.container
      @_options.container.appendChild @rootElement
    window.addEventListener 'message', (event) ->
      if _this.rootElement.contentWindow != event.source
        return
      data = event.data
      if data.event
        _this._eventEmitter.emit data.event, data.value, _this
        if _this._options.checkViewPort
          _this._viewPortChecker data.event
      return
    return

  Object.defineProperty Player.prototype, 'storyUrl',
    get: ->
      parameters = 
        autoStart: @_options.autoStart
        addLooping: @_options.loop
        hideOverlay: @_options.hideOverlay
        roundedCorners: @_options.roundedCorners
      queryString = Object.keys(parameters).map((key) ->
        value = parameters[key]
        encodeURIComponent(key) + '=' + encodeURIComponent(value)
      ).join('&')
      url = undefined
      if ! !@_options.viewKey
        url = 'https://live.gobiapp.com/next/story/viewKey/'
        url += @_options.viewKey
      else
        url = 'https://live.gobiapp.com/next/story/id/'
        url += @_options.storyName
      url + '?' + queryString
    enumerable: true
    configurable: true

  Player::load = (options) ->
    Object.assign @_options, options
    @rootElement.src = @storyUrl
    return

  Player::play = ->
    @_callPlayerMethod 'play'
    return

  Player::pause = ->
    @_callPlayerMethod 'pause'
    return

  Player::reload = ->
    @_callPlayerMethod 'reset'
    return

  Player::setMute = (flag) ->
    @_callPlayerMethod 'setMute', flag
    return

  Player::isInViewport = ->
    distance = @rootElement.getBoundingClientRect()
    viewportHeight = window.innerHeight or document.documentElement.clientHeight
    viewportWidth = window.innerWidth or document.documentElement.clientWidth
    hiddenHeight = distance.height * 0.8
    hiddenWidth = distance.width * 0.8
    distance.top >= 0 - hiddenHeight and distance.left >= 0 - hiddenWidth and distance.bottom <= viewportHeight + hiddenHeight and distance.right <= viewportWidth + hiddenWidth

  Player::_callPlayerMethod = (name, arg) ->
    if arg == undefined
      arg = undefined
    @_sendMessage
      method: name
      value: arg
    return

  Player::_sendMessage = (message) ->
    target = @rootElement.contentWindow
    if target
      target.postMessage message, '*'
    return

  Player::_createIframe = ->
    iframe = document.createElement('iframe')
    size = @_calculatePlayerSize()
    iframe.src = @storyUrl
    iframe.width = size.width.toString()
    iframe.height = size.height.toString()
    iframe.frameBorder = '0'
    iframe.scrolling = 'no'
    iframe.style.overflow = 'hidden'
    iframe.style.background = '#000'
    iframe.style.border = '0'
    if @_options.shadow
      iframe.classList.add 'gobi-player-shadow'
    if @_options.roundedCorners
      iframe.style.borderRadius = '10px'
    iframe.setAttribute 'allow', 'autoplay;'
    iframe

  Player::_viewPortChecker = (playerEventName) ->
    switch playerEventName
      when 'play'
        @_addIsOutOfScreenChecker()
      when 'pause'
        if @isInViewport()
          @_removeIsOnScreenChecker()
          @_removeIsOutOfScreenChecker()
      when 'ended'
        @_removeIsOnScreenChecker()
        @_removeIsOutOfScreenChecker()
    return

  Player::_addIsOutOfScreenChecker = ->
    _this = this
    @_removeIsOutOfScreenChecker()
    @_removeIsOnScreenChecker()
    window.addEventListener 'scroll', @_isOutOfScreenChecker

    @_removeIsOutOfScreenChecker = ->
      window.removeEventListener 'scroll', _this._isOutOfScreenChecker

    return

  Player::_addIsOnScreenChecker = ->
    _this = this
    window.addEventListener 'scroll', @_isOnScreenChecker

    @_removeIsOnScreenChecker = ->
      window.removeEventListener 'scroll', _this._isOnScreenChecker

    return

  Player::_calculatePlayerSize = ->
    width = 612
    height = 1088
    aspectRatio = 0.5625
    # 9/16
    if @_options.width and @_options.height
      width = @_options.width
      height = @_options.height
    else if @_options.width
      width = @_options.width
      height = width / aspectRatio
    else if @_options.height
      height = @_options.height
      width = height * aspectRatio
    {
      width: width
      height: height
    }

  Player
exports.default = Player
