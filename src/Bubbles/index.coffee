'use strict'
Object.defineProperty exports, '__esModule', value: true
tslib_1 = require('tslib')
utils_1 = require('@/utils/utils')
Popup_1 = tslib_1.__importDefault(require('@/Popup'))
Story_1 = tslib_1.__importDefault(require('@/Story'))
Player_1 = tslib_1.__importDefault(require('@/Player'))
Bubbles = do ->
  `var Bubbles`

  Bubbles = (options) ->
    @rootElement = @_createTemplate(options.verticalOrientation, ! !options.wrap)
    @_title = options.title or ''
    @title = @_title
    @stories = @_createStories(options.stories, options.color, options.avatarSize, options.showNewStoryQrBubble)
    @_currentStory = @stories[0]
    @player = new (Player_1.default)(Object.assign({
      viewKey: @currentStory.viewKey
      storyName: @currentStory.id
      checkViewPort: false
    }, options.playerOptions))
    @popup = new (Popup_1.default)(player: @player)
    if options.container
      @append options.container
    return

  Object.defineProperty Bubbles.prototype, 'title',
    get: ->
      @_title
    set: (title) ->
      titleEl = @rootElement.querySelector('[data-title]')
      if titleEl
        @_title = title or ''
        titleEl.textContent = @_title
        titleEl.style.display = if @_title then '' else 'none'
      return
    enumerable: true
    configurable: true
  Object.defineProperty Bubbles.prototype, 'currentStory',
    get: ->
      @_currentStory
    set: (story) ->
      @_currentStory = story
      @player.load
        viewKey: @_currentStory.viewKey
        storyName: @_currentStory.id
      return
    enumerable: true
    configurable: true

  Bubbles::getViewKeys = ->
    @stories.map (story) ->
      story.viewKey

  Bubbles::getKeys = ->
    @stories.map (story) ->
      {
        viewKey: story.viewKey
        secretKey: story.secretKey
      }

  Bubbles::append = (container) ->
    document.body.appendChild @popup.rootElement
    container.appendChild @rootElement
    return

  Bubbles::remove = ->
    container = @rootElement.parentElement
    if container
      document.body.removeChild @popup.rootElement
      container.removeChild @rootElement
      @popup.close()
    return

  Bubbles::_createStories = (storyOptionsArray, color, avatarSize, showNewStoryQrBubble) ->
    _this = this
    storiesContainer = @rootElement.querySelector('[data-stories]')
    stories = storyOptionsArray.map((storyOptions) ->
      new (Story_1.default)(
        viewKey: storyOptions.viewKey
        secretKey: storyOptions.secretKey
        id: storyOptions.id
        container: storiesContainer
        avatarSrc: storyOptions.avatarSrc
        title: storyOptions.title
        description: storyOptions.description
        titleColor: storyOptions.titleColor
        descriptionColor: storyOptions.descriptionColor
        color: color
        avatarSize: avatarSize
        onSelect: _this._onStorySelect.bind(_this))
    )
    if showNewStoryQrBubble
      qrStory = new (Story_1.default)(
        container: storiesContainer
        color: color
        avatarSize: avatarSize
        onSelect: @_onStorySelect.bind(this))
      stories.push qrStory
    stories

  Bubbles::_onStorySelect = (abstractStory) ->
    @currentStory = abstractStory
    @popup.open()
    return

  Bubbles::_createTemplate = (isVertical, isWrap) ->

    onTouch = ->
      container.classList.remove classPrefix + '--hoverable'
      removeListeners()
      return

    removeListeners = ->
      window.removeEventListener 'touchstart', onTouch
      window.removeEventListener 'mousemove', removeListeners
      return

    if isVertical == undefined
      isVertical = false
    container = document.createElement('div')
    classPrefix = 'gobi-popup-module'
    container.classList.add classPrefix
    container.classList.add classPrefix + '--hoverable'
    container.innerHTML = Bubbles._HTML
    utils_1.addPrefixToClassName container.querySelectorAll('*'), classPrefix + '__'
    storiesContainerEl = container.lastElementChild
    if isVertical
      storiesContainerEl.classList.add classPrefix + '__stories--vertical'
    else
      storiesContainerEl.classList.add classPrefix + '__stories--horizontal'
    if !isWrap
      storiesContainerEl.classList.add classPrefix + '__stories--no-wrap'
    if 'ontouchstart' of window or navigator.maxTouchPoints
      window.addEventListener 'touchstart', onTouch
      window.addEventListener 'mousemove', removeListeners
    container

  Object.defineProperty Bubbles, '_HTML',
    get: ->
      '<div class="title" data-title></div>\n                <div class="stories" data-stories></div>'
    enumerable: true
    configurable: true
  Bubbles
exports.default = Bubbles
