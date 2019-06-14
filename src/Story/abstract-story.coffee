'use strict'
Object.defineProperty exports, '__esModule', value: true
tslib_1 = require('tslib')
event_emitter_1 = tslib_1.__importDefault(require('@/utils/event-emitter'))
utils_1 = require('@/utils/utils')
utils_2 = require('@/utils/utils')
socket_io_client_1 = tslib_1.__importDefault(require('socket.io-client'))
AbstractStory = do ->
  `var AbstractStory`

  AbstractStory = (options) ->
    _this = this
    @_listenerRemoveFunctions = []
    @_eventEmitter = new (event_emitter_1.default)
    @on = @_eventEmitter.on.bind(@_eventEmitter)
    @off = @_eventEmitter.off.bind(@_eventEmitter)
    @_avatarSrc = ''
    @rootElement = @_createTemplate()
    @_elems =
      title: @_getElem('title')
      description: @_getElem('description')
      avatar: @_getElem('avatar')
      avatarContainer: @_getElem('avatarContainer')
    @id = options.id or ''
    @viewKey = options.viewKey or ''
    @secretKey = options.secretKey or ''
    @_title = options.title or ''
    @avatarSrc = options.avatarSrc or ''
    if @id or @viewKey
      if !options.avatarSrc or !@_title
        promise = undefined
        if @viewKey
          promise = utils_2.fetchAvatarAndTitleGivenViewKey(@viewKey)
          promise.catch (error) ->
            # story likely empty, assume it is empty
            # assume storyName is viewKey, not always true
            storyName = _this.viewKey
            _this.secretKey and _this.putQrInAvatar(storyName, _this.secretKey)
            return
          @setupSocketToListenForNewMediaInStory()
        else
          promise = utils_2.fetchAvatarAndTitleGivenStoryId(@id)
        promise.then (data) ->
          _this.avatarSrc = _this.avatarSrc or data.src
          _this.title = _this.title or data.title
          return
    else
      @secretKey = utils_1.makeRandomStorySecretKey()
      @viewKey = utils_1.makeViewKey(@secretKey)
      storyName = @viewKey.slice(0, 20)
      @putQrInAvatar storyName, @secretKey
      # User now scans this QR with their phone, and adds a video
      @setupSocketToListenForNewMediaInStory()
    @_description = options.description or ''
    @_color = options.color or ''
    @_addSelectEmitter()
    if typeof options.onSelect == 'function'
      @_eventEmitter.on 'select', options.onSelect
    if options.container
      options.container.appendChild @rootElement
    return

  Object.defineProperty AbstractStory.prototype, 'avatarSrc',
    get: ->
      @_avatarSrc
    set: (src) ->
      @_avatarSrc = src
      @_elems.avatar.style.backgroundImage = 'url(' + src + ')'
      return
    enumerable: true
    configurable: true

  AbstractStory::checkForVideoInStory = ->
    _this = this
    promise = utils_2.fetchAvatarAndTitleGivenViewKey(@viewKey)
    promise.then((data) ->
      _this.avatarSrc = data.src
      _this.title = data.title
      return
    ).catch (err) ->
    return

  AbstractStory::mediaDetected = (media) ->
    @socket.disconnect()
    @checkForVideoInStory()
    return

  AbstractStory::socketConnected = ->
    @socket.on 'media', @mediaDetected.bind(this)
    @socket.emit 'subscribe_to_story_media', viewKey: @viewKey
    return

  AbstractStory::setupSocketToListenForNewMediaInStory = ->
    @socket = socket_io_client_1.default('https://live.gobiapp.com')
    @socket.on 'connect', @socketConnected.bind(this)
    return

  AbstractStory::putQrInAvatar = (storyName, secretKey) ->
    tslib_1.__awaiter this, undefined, undefined, ->
      data = undefined
      result = undefined
      qrData = undefined
      dataUrl = undefined
      tslib_1.__generator this, (_a) ->
        switch _a.label
          when 0
            data = utils_1.makeBranchQueryData(storyName, secretKey)
            return [
              4
              utils_1.getBranchLink(data)
            ]
          when 1
            result = _a.sent()
            qrData = result.url
            @title = qrData
            return [
              4
              utils_1.qrDataToDataUrl(qrData)
            ]
          when 2
            dataUrl = _a.sent()
            @avatarSrc = dataUrl
            return [ 2 ]
        return

  AbstractStory::destroy = ->
    if @rootElement.parentElement
      @rootElement.parentElement.removeChild @rootElement
    @_eventEmitter.off()
    i = @_listenerRemoveFunctions.length
    while i--
      @_listenerRemoveFunctions[i]()
    return

  AbstractStory::_addSelectEmitter = ->
    _this = this
    selectAreas = @rootElement.querySelectorAll('[data-select-area]')

    selectClickCallback = ->
      _this._eventEmitter.emit 'select', _this
      return

    _loop_1 = (i) ->
      selectAreas[i].addEventListener 'click', selectClickCallback
      this_1._listenerRemoveFunctions.push ->
        selectAreas[i].removeEventListener 'click', selectClickCallback
      return

    this_1 = this
    i = selectAreas.length
    while i--
      _loop_1 i
    return

  AbstractStory::_getElem = (name) ->
    attr = 'data-' + name
    elem = @rootElement.querySelector('[' + attr + ']')
    if elem
      elem.removeAttribute attr
      return elem
    else
      throw new Error('Story does not contain element with name:' + name)
    return

  AbstractStory
exports.default = AbstractStory
