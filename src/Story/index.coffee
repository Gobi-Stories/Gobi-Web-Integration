utils = require('@/utils/utils')
socket_io_client_1 = require('socket.io-client')
Function::property = (name, getset) -> Object.defineProperty @prototype, name, getset

class Story
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
    
    @_selected = false
    if options.titleColor
      @_elems.title.style.color = options.titleColor
    if options.descriptionColor
      @_elems.description.style.color = options.descriptionColor
    if options.titleSize
      @_elems.title.style.fontSize = options.titleSize
    if options.descriptionSize
      @_elems.description.style.fontSize = options.descriptionSize
    if options.avatarSize # happens multiple times :(
      s = options.avatarSize
      css = ''
      css += '.gobi-popup-story__avatar-container {'
      css += ' width: ' + s + ';'
      css += ' margin: calc(0.1 * ' + s + ') calc(.2*' + s + ');'
      css += '}'
      css += '.gobi-popup-module--hoverable .gobi-popup-story__avatar-container:hover {'
      css += '  width: calc(1.2 * ' + s + ');'
      css += '  margin: 0px calc(.1*' + s + ');'
      css += '}'
      css += '@media all and (max-width: 767px) {'
      css += '  &__avatar-container {'
      css += '    width: ' + s + ';'
      css += '    margin: calc(0.1 * ' + s + ') calc(.2*' + s + ');'
      css += '  }'
      css += '  .gobi-popup-module--hoverable &__avatar-container:hover {'
      css += '    width: calc(1.2 * ' + s + '); /* compute from bubble size*/'
      css += '    margin: 0px calc(.1*' + s + ');'
      css += '  }'
      css += '}'
      hoverStyle = document.createElement('style')
      hoverStyle.appendChild document.createTextNode(css)
      document.getElementsByTagName('head')[0].appendChild hoverStyle
    @_selected = ! !options.selected
    @title = @_title
    @description = @_description
    @color = @_color
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

  @property 'selected',
    get: ->
      @_selected
    set: (selected) ->
      if selected
        @rootElement.classList.add 'gobi-story--selected'
      else
        @rootElement.classList.remove 'gobi-story--selected'
      @_selected = selected
  @property 'title',
    get: ->
      @_title
    set: (title) ->
      @_title = title
      if title.match(/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/)
        @_elems.title.href = title
        @_elems.title.textContent = title.replace(new RegExp('^https?://'), '')
      else
        @_elems.title.textContent = title
        delete @_elems.title.href
  @property 'description',
    get: ->
      @_description
    set: (description) ->
      @_description = description
      @_elems.description.textContent = description
  @property 'color',
    get: ->
      @_color
    set: (color) ->
      @_color = color
      avatarCircleBorder = @_elems.avatarContainer.querySelector '.gobi-popup-story__avatar-circle'
      avatarCircleBorder?.style.stroke = color
  _createTemplate: ->
    # "desktop": const classPrefix = 'gobi-story';
    classPrefix = 'gobi-popup-story'
    container = document.createElement('div')
    container.classList.add 'gobi-popup-story'
    container.innerHTML = '<div class="gobi-popup-story__avatar-container" data-select-area data-avatarContainer>' +
      '<div class="gobi-popup-story__avatar" data-avatar></div>' +
      '<svg class="gobi-popup-story__avatar-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
      '<circle class="gobi-popup-story__avatar-circle" cx="60" cy="60" r="57" fill="none" stroke="#15d6ea" stroke-width="3" stroke-dasharray="370.52" stroke-dashoffset="370.52" />' +
      '</svg>' +
      '</div>' +
      '<a class="gobi-popup-story__title" target="_blank" data-title></a>' +
      '<div class="gobi-popup-story__description"><div class="gobi-popup-story__description-text"></div></div>'
    container

module.exports = Story
