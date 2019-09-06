event_emitter_1 = require('@/utils/event-emitter')
Function::property = (name, getset) -> Object.defineProperty @prototype, name, getset
isInViewport = require('@/utils/utils').isInViewport

makeQueryString = (parameters) ->
  Object.keys(parameters).map (key) ->
    value = parameters[key]
    encodeURIComponent(key) + '=' + encodeURIComponent(value)
  .join '&'

class Player
  constructor: (options) ->
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
    @_eventEmitter = new event_emitter_1()
    @on = @_eventEmitter.on.bind(@_eventEmitter)
    @off = @_eventEmitter.off.bind(@_eventEmitter)
    @_removeIsOnScreenChecker = ->
    @_removeIsOutOfScreenChecker = ->
    @_isOutOfScreenChecker = ->
      return if not @rootElement
      if !isInViewport @rootElement
        _this.pause()
        _this._removeIsOutOfScreenChecker()
        _this._addIsOnScreenChecker()
    @_isOnScreenChecker = ->
      if isInViewport @rootElement
        _this.play()
        _this._removeIsOnScreenChecker()
        _this._addIsOutOfScreenChecker()
    @_options = Object.assign({}, @_defaultOptions, options)
    @rootElement = @_createIframe @_options.container?.clientWidth
    if @_options.container
      @_options.container.appendChild @rootElement
    window.addEventListener 'message', (event) ->
      if _this.rootElement.contentWindow != event.source
        return
      data = event.data
      if data.event
        _this._eventEmitter.emit data.event, data.value, _this
        if _this._options.checkViewPort
          _this._viewPortChecker data.event, _this.rootElement
  @property 'storyUrl',
    get: ->
      parameters = 
        autoStart: @_options.autoStart
        addLooping: @_options.loop
        hideOverlay: @_options.hideOverlay
        roundedCorners: @_options.roundedCorners
      queryString = makeQueryString parameters
      url = undefined
      if !!@_options.viewKey
        url = 'https://live.gobiapp.com/next/story/viewKey/'
        url += @_options.viewKey
      else
        url = 'https://live.gobiapp.com/next/story/id/'
        url += @_options.storyName
      url + '?' + queryString
  load: (options, callback) ->
    Object.assign @_options, options
    @rootElement.onload = callback
    @rootElement.src = @storyUrl
  hide: ->
    @_options.container?.style['display'] = 'none'
  show: ->
    @_options.container?.style['display'] = ''
  play: ->
    @_callPlayerMethod 'play'
    @show()
  pause: ->
    @_callPlayerMethod 'pause'
  reload: ->
    @_callPlayerMethod 'reset'
    @show()
  setMute: (flag) ->
    @_callPlayerMethod 'setMute', flag
  _callPlayerMethod: (name, arg) ->
    if arg == undefined
      arg = undefined
    @_sendMessage
      method: name
      value: arg
  _sendMessage: (message) ->
    target = @rootElement.contentWindow
    if target
      target.postMessage message, '*'
  _createIframe: (clientWidth) ->
    iframe = document.createElement('iframe')
    size = @_calculatePlayerSize clientWidth
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
  _viewPortChecker: (playerEventName, element) ->
    switch playerEventName
      when 'play'
        @_addIsOutOfScreenChecker()
      when 'pause'
        if isInViewport element
          @_removeIsOnScreenChecker()
          @_removeIsOutOfScreenChecker()
      when 'ended'
        @_removeIsOnScreenChecker()
        @_removeIsOutOfScreenChecker()
  _addIsOutOfScreenChecker: ->
    _this = this
    @_removeIsOutOfScreenChecker()
    @_removeIsOnScreenChecker()
    window.addEventListener 'scroll', @_isOutOfScreenChecker
    @_removeIsOutOfScreenChecker = ->
      window.removeEventListener 'scroll', _this._isOutOfScreenChecker
  _addIsOnScreenChecker: ->
    _this = this
    window.addEventListener 'scroll', @_isOnScreenChecker
    @_removeIsOnScreenChecker = ->
      window.removeEventListener 'scroll', _this._isOnScreenChecker
  _calculatePlayerSize: (clientWidth) ->
    width = clientWidth or 612
    aspectRatio = 0.5625
    height = width/aspectRatio
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
    {width: width, height: height}
module.exports = Player
