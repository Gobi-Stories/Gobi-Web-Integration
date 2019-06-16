event_emitter_1 = require('@/utils/event-emitter')
utils = require('@/utils/utils')
socket_io_client_1 = require('socket.io-client')
Function::property = (name, getset) -> Object.defineProperty @prototype, name, getset

class AbstractStory
  constructor: (options) ->
    @_listenerRemoveFunctions = []
    @_eventEmitter = new event_emitter_1()
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
          promise = utils.fetchAvatarAndTitleGivenViewKey @viewKey
          promise.catch (error) =>
            # story likely empty, assume it is empty
            # assume storyName is viewKey, not always true
            storyName = @viewKey
            if @secretKey then @putQrInAvatar storyName, @secretKey
          @setupSocketToListenForNewMediaInStory()
        else
          promise = utils.fetchAvatarAndTitleGivenStoryId @id
        promise.then (data) =>
          @avatarSrc = @avatarSrc or data.src
          @title = @title or data.title
    else
      @secretKey = utils.makeRandomStorySecretKey()
      @viewKey = utils.makeViewKey @secretKey
      storyName = @viewKey.slice(0, 20)
      @putQrInAvatar storyName, @secretKey
      # User now scans this QR with their phone, and adds a video
      @setupSocketToListenForNewMediaInStory()
    @_description = options.description or ''
    @_color = options.color or ''
    @_addSelectEmitter()
    if typeof options.onSelect is 'function'
      @_eventEmitter.on 'select', options.onSelect
    options.container?.appendChild @rootElement
  @property 'avatarSrc',
    get: ->
      @_avatarSrc
    set: (src) ->
      @_avatarSrc = src
      @_elems.avatar.style.backgroundImage = 'url(' + src + ')'
  checkForVideoInStory: ->
    promise = utils.fetchAvatarAndTitleGivenViewKey @viewKey
    promise.then (data) ->
      @avatarSrc = data.src
      @title = data.title
  mediaDetected: (media) ->
    @socket.disconnect()
    @checkForVideoInStory()
  socketConnected: ->
    @socket.on 'media', => @mediaDetected()
    @socket.emit 'subscribe_to_story_media', viewKey: @viewKey
  setupSocketToListenForNewMediaInStory: ->
    @socket = socket_io_client_1 'https://live.gobiapp.com'
    @socket.on 'connect', => @socketConnected()
  putQrInAvatar: (storyName, secretKey) ->
    data = utils.makeBranchQueryData storyName, secretKey
    result = await utils.getBranchLink data
    qrData = result.url
    @title = qrData
    dataUrl = await utils.qrDataToDataUrl qrData
    @avatarSrc = dataUrl
  destroy: ->
    if @rootElement.parentElement
      @rootElement.parentElement.removeChild @rootElement
    @_eventEmitter.off()
    i = @_listenerRemoveFunctions.length
    while i--
      @_listenerRemoveFunctions[i]()
  _addSelectEmitter: ->
    selectAreas = @rootElement.querySelectorAll('[data-select-area]')
    selectClickCallback = => @_eventEmitter.emit 'select', @
    _loop_1 = (i) ->
      selectAreas[i].addEventListener 'click', selectClickCallback
      this_1._listenerRemoveFunctions.push ->
        selectAreas[i].removeEventListener 'click', selectClickCallback
    this_1 = this
    i = selectAreas.length
    while i--
      _loop_1 i
  _getElem: (name) ->
    attr = 'data-' + name
    elem = @rootElement.querySelector '[' + attr + ']'
    if elem
      elem.removeAttribute attr
      elem
    else
      throw new Error 'Story does not contain element with name:' + name

module.exports = AbstractStory
