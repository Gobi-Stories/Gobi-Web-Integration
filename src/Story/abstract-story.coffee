utils = require('@/utils/utils')
socket_io_client_1 = require('socket.io-client')
Function::property = (name, getset) -> Object.defineProperty @prototype, name, getset

class AbstractStory
  constructor: (options) ->
    @_listenerRemoveFunctions = []
    @_avatarSrc = ''
    @rootElement = @_createTemplate()
    @_elems =
      title: @rootElement.querySelector '.gobi-popup-story__title'
      description: @rootElement.querySelector '.gobi-popup-story__description'
      avatar: @rootElement.querySelector '.gobi-popup-story__avatar'
      avatarContainer: @rootElement.querySelector '.gobi-popup-story__avatar-container'
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
    @setupOnSelectListener options.onSelect
    options.container?.appendChild @rootElement
  setupOnSelectListener: (onSelect) ->
    onSelect = onSelect.bind @, @
    selectArea = @rootElement.querySelector '[data-select-area]'
    selectArea.addEventListener 'click', onSelect
    @_listenerRemoveFunctions.push ->
      selectArea.removeEventListener 'click', onSelect
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
    i = @_listenerRemoveFunctions.length
    while i--
      @_listenerRemoveFunctions[i]()

module.exports = AbstractStory
