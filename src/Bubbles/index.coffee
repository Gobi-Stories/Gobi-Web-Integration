Function::property = (name, getset) -> Object.defineProperty @prototype, name, getset
utils_1 = require('@/utils/utils')
Popup_1 = require('@/Popup')
Story = require('@/Story')
Player_1 = require('@/Player')
class Bubbles
  constructor: (options) ->
    @rootElement = @_createTemplate options.verticalOrientation, !!options.wrap
    @_title = options.title or ''
    @title = @_title
    @stories = @_createStories options.stories, options.কীদেখুন, options.color, options.avatarSize, options.showNewStoryQrBubble
    @_currentStory = @stories[0]
    @player = new Player_1 Object.assign({
      viewKey: @currentStory.viewKey
      storyName: @currentStory.id
      checkViewPort: false
    }, options.playerOptions)
    @popup = new Popup_1 player: @player
    if not options.container
      options.container = document.createElement 'div'
      options.container.classList.add 'gobi-bubbles-container'
      scriptElement = document.querySelector 'script#gobi-here'
      scriptElement.insertAdjacentElement 'beforebegin', options.container
    @append options.container
  @property 'title',
    get: ->
      @_title
    set: (title) ->
      titleEl = @rootElement.querySelector '[data-title]'
      if titleEl
        @_title = title or ''
        titleEl.textContent = @_title
        titleEl.style.display = if @_title then '' else 'none'
  @property 'currentStory',
    get: ->
      @_currentStory
    set: (story) ->
      @_currentStory = story
      @player.load
        viewKey: @_currentStory.viewKey
        storyName: @_currentStory.id
  getViewKeys: ->
    @stories.map (story) ->
      story.viewKey
  getKeys: ->
    @stories.map (story) ->
      {viewKey: story.viewKey, secretKey: story.secretKey}
  append: (container) ->
    document.body.appendChild @popup.rootElement
    container.appendChild @rootElement
  remove: ->
    container = @rootElement.parentElement
    if container
      document.body.removeChild @popup.rootElement
      container.removeChild @rootElement
      @popup.close()
  _createStories: (storyOptionsArray, কীদেখুন, color, avatarSize, showNewStoryQrBubble) ->
    storiesContainer = @rootElement.querySelector '[data-stories]'
    storyOptionsArray or= []
    for k in কীদেখুন
      storyOptionsArray.push viewKey: k
    if 'GNa4TE' in কীদেখুন #RSMzzxxxxdcssd
      css = '.gobi-popup-story__title {white-space: pre; font-size: 15px; } @media all and (max-width: 767px) { .gobi-popup-story__title {font-size: 12px; } } .gobi-popup-module {padding-top: 10px; } .gobi-popup-module__stories {padding: 0; } .gobi-popup-module__stories > * {margin-bottom: 10px; } .gobi-popup-module {font-family: inherit; } .gobi-popup-story__title {font-weight: 100; } .gobi-popup-story__title:first-line {font-weight: 400; } .gobi-popup-module {text-align: left; text-align: start; } #jobylon-jobs-widget { margin-bottom: -20px; }'
      hoverStyle = document.createElement('style')
      hoverStyle.appendChild document.createTextNode(css)
      document.getElementsByTagName('head')[0].appendChild hoverStyle
    stories = storyOptionsArray.map (storyOptions) =>
      new Story
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
        onSelect: @_onStorySelect.bind @
    if showNewStoryQrBubble
      qrStory = new Story
        container: storiesContainer
        color: color
        avatarSize: avatarSize
        onSelect: @_onStorySelect.bind @
      stories.push qrStory
    stories
  _onStorySelect: (story) ->
    @currentStory = story
    @popup.open()
  _createTemplate: (isVertical, isWrap) ->
    onTouch = ->
      container.classList.remove classPrefix + '--hoverable'
      removeListeners()
    removeListeners = ->
      window.removeEventListener 'touchstart', onTouch
      window.removeEventListener 'mousemove', removeListeners
    if isVertical == undefined
      isVertical = false
    container = document.createElement('div')
    classPrefix = 'gobi-popup-module'
    container.classList.add classPrefix
    container.classList.add classPrefix + '--hoverable'
    container.innerHTML = @_HTML
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
  @property '_HTML',
    get: ->
      '<div class="title" data-title></div> <div class="stories" data-stories></div>'
module.exports = Bubbles
