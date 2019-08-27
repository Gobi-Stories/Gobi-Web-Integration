Function::property = (name, getset) -> Object.defineProperty @prototype, name, getset
Popup_1 = require('@/Popup')
Story = require('@/Story')
Player = require '@/Player'
isInViewport = require('@/utils/utils').isInViewport

useGobiHereContainer = (options) ->
  options.container = document.createElement 'div'
  options.container.classList.add 'gobi-bubbles-container'
  gobiHereContainer = document.querySelector '#gobi-here'
  if not gobiHereContainer
    gobiHereContainer = document.querySelector 'body'
    gobiHereContainer?.insertAdjacentElement 'afterbegin', options.container
    console.error 'You must specify a container in the Bubbles() constructor, or, add an ' +
      'element in your HTML with the magic ID like <div id="gobi-here"><div>.'
    console.error 'Adding to top of <body> so you see at least something.'
  else
    gobiHereContainer?.insertAdjacentElement 'beforebegin', options.container

class Bubbles
  constructor: (options) ->
    @rootElement = @_createTemplate options.verticalOrientation, !!options.wrap
    @responsive = options.responsive
    @_title = options.title or ''
    @title = @_title
    options.viewKeys or= options.কীদেখুন or []
    @stories = @_createStories options.stories, options.viewKeys, options.color, options.avatarSize, options.showNewStoryQrBubble
    @_currentStory = @stories[0]
    @_playerContainer = @rootElement.querySelector '.gobi-popup-module__player'
    playerOptions = Object.assign({
      viewKey: @_currentStory.viewKey
      storyName: @_currentStory.id
      checkViewPort: false
      container: @_playerContainer
    }, options.playerOptions)
    @player = new Player playerOptions
    @nei = new Player playerOptions
    @popup = new Popup_1 player: @nei
    useGobiHereContainer options if not options.container
    @addToDom options.container
    @layout = options.layout
    @reconsiderLayoutTimeout = null
    @viewPortCheckerTimeout = null
    if @responsive
      window.addEventListener 'resize', @debounceReconsiderLayout
    window.addEventListener 'scroll', @debounceViewPortChecker
    @viewPortChecker()
  debounceReconsiderLayout: =>
    clearTimeout @reconsiderLayoutTimeout if @reconsiderLayoutTimeout
    @reconsiderLayoutTimeout = setTimeout @reconsiderLayout.bind(@), 500
  debounceViewPortChecker: =>
    clearTimeout @viewPortCheckerTimeout if @viewPortCheckerTimeout
    @viewPortCheckerTimeout = setTimeout @viewPortChecker.bind(@), 500
  reconsiderLayout: =>
    if @rootElement.clientWidth < 767
      @player.hide()
      @player.pause()
      @rootElement.querySelector '.gobi-popup-module__player-block'
      .classList.remove 'gobi-popup-module__player-block--all-inline'
      @rootElement.querySelector '.gobi-popup-module__stories-block'
      .classList.remove 'gobi-popup-module__stories-block--all-inline'
    else
      @rootElement.querySelector '.gobi-popup-module__player-block'
      .classList.add 'gobi-popup-module__player-block--all-inline'
      @rootElement.querySelector '.gobi-popup-module__stories-block'
      .classList.add 'gobi-popup-module__stories-block--all-inline'
      @player.show()
      @popup.close()
  viewPortChecker: ->
    if isInViewport @rootElement
      @showAnimBorder()
    else
      @hideAnimBorder()
  showAnimBorder: ->
    bubblesBorder = Array.prototype.slice.call @rootElement.querySelectorAll '.gobi-popup-story__avatar-circle'
    bubblesBorder.forEach (bubble) ->
      bubble.style.animation = 'bubbleBorderDraw 800ms ease-in-out 100ms forwards'
  hideAnimBorder: ->
    bubblesBorder = Array.prototype.slice.call @rootElement.querySelectorAll '.gobi-popup-story__avatar-circle'
    bubblesBorder.forEach (bubble) ->
      bubble.style.animation = 'none'
  @property 'title',
    get: ->
      @_title
    set: (title) ->
      t = @rootElement.querySelector '.gobi-popup-module__title'
      if t
        @_title = title or ''
        t.textContent = @_title
        t.style.display = if @_title then '' else 'none'
  setCurrentStory: (story, callback) ->
    @_currentStory = story
    @player.load
      viewKey: @_currentStory.viewKey
      storyName: @_currentStory.id
    , callback
    @nei.load
      viewKey: @_currentStory.viewKey
      storyName: @_currentStory.id
    , callback
  getViewKeys: ->
    @stories.map (story) ->
      story.viewKey
  getKeys: ->
    @stories.map (story) ->
      {viewKey: story.viewKey, secretKey: story.secretKey}
  addToDom: (container) ->
    document.body.appendChild @popup.rootElement
    container.appendChild @rootElement
    alwaysDoPopup = not @responsive
    doPopupNow = @rootElement.clientWidth < 767
    if alwaysDoPopup or doPopupNow
      @popup.open()
      @player.hide()
      @rootElement.querySelector '.gobi-popup-module__player-block'
      .classList.remove 'gobi-popup-module__player-block--all-inline'
      @rootElement.querySelector '.gobi-popup-module__stories-block'
      .classList.remove 'gobi-popup-module__stories-block--all-inline'
    else
      @player.show()
      @rootElement.querySelector '.gobi-popup-module__player-block'
      .classList.add 'gobi-popup-module__player-block--all-inline'
      @rootElement.querySelector '.gobi-popup-module__stories-block'
      .classList.add 'gobi-popup-module__stories-block--all-inline'
  remove: ->
    container = @rootElement.parentElement
    if container
      document.body.removeChild @popup.rootElement
      container.removeChild @rootElement
      @popup.close()
  _createStories: (storyOptionsArray, viewKeys, color, avatarSize, showNewStoryQrBubble) ->
    storiesContainer = @rootElement.querySelector '.gobi-popup-module__stories'
    storyOptionsArray or= []
    for k in viewKeys
      storyOptionsArray.push viewKey: k
    if 'GNa4TE' in viewKeys #RSMzzxxxxdcssd
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
    @setCurrentStory story, =>
      alwaysDoPopup = not @responsive
      doPopupNow = @rootElement.clientWidth < 767
      if alwaysDoPopup or doPopupNow
        @popup.open()
      else
        @player.play()
  onTouch: (container) =>
    container.classList.remove 'gobi-popup-module--hoverable'
    @removeListeners()
  removeListeners: (onTouch) =>
    window.removeEventListener 'touchstart', onTouch
    window.removeEventListener 'mousemove', @removeListeners
  _createTemplate: (isVertical, isWrap) ->
    container = document.createElement 'div'
    container.classList.add 'gobi-popup-module'
    container.classList.add 'gobi-popup-module--hoverable'
    container.innerHTML = '<div class="gobi-popup-module__player-block"><div class="gobi-popup-module__player"></div></div><div class="gobi-popup-module__title"></div><div class="gobi-popup-module__stories-block"><div class="gobi-popup-module__stories"></div></div>'
    storiesContainer = container.querySelector '.gobi-popup-module__stories'
    isVertical = false unless isVertical
    if isVertical
      storiesContainer.classList.add 'gobi-popup-module__stories--vertical'
    else
      storiesContainer.classList.add 'gobi-popup-module__stories--horizontal'
    if not isWrap then storiesContainer.classList.add 'gobi-popup-module__stories--no-wrap'
    if 'ontouchstart' of window or navigator.maxTouchPoints
      onTouch = @onTouch.bind @, container
      window.addEventListener 'touchstart', onTouch
      window.addEventListener 'mousemove', @removeListeners.bind @, onTouch
    container

module.exports = Bubbles
