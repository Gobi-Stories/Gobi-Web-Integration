utils_1 = require('@/utils/utils')
Function::property = (name, getset) -> Object.defineProperty @prototype, name, getset
# Popup is the overlay that contains the iframe with the Gobi Player.
# The overlay is a half-transparent black fullpage background.
# Popup puts a close X button on the player, adds an Escape button listener, and also quits if
# the background overlay is clicked.
# Popup does not contain the player itself, it only shows it using an iframe.
# Classes for this component start with gobi-popup__.
# The other components are not part of this popup, and thus should be renamed from
# gobi-popup-* to gobi-storyset-*, or something else.
class Popup
  constructor: (options) ->
    @_isOpen = false
    @_defaultOptions =
      classes: ''
      openers: ''
    @_listenerRemoveFunctions = []
    _options = Object.assign {}, @_defaultOptions, options
    @rootElement = document.createElement 'div'
    @rootElement.className = _options.classes or ''
    @content = document.createElement 'div'
    @content.className = 'gobi-popup__content'
    @iframeContainer = document.createElement 'div'
    @iframeContainer.className = 'gobi-popup__iframe-container'
    @_createTemplate()
    @player = _options.player
    @appendPlayer @player
    @rootElement.addEventListener 'click', @_onClick.bind @
    @content.addEventListener 'click', @_onClick.bind @
  _onClick: (event) ->
    # event.currentTarget is element that the event listener was attached to.
    # event.target is the child-most element clicked
    @close() if event.target is event.currentTarget
  @property 'isOpen',
    get: -> @_isOpen
  appendPlayer: (player) ->
    @player = player
    @iframeContainer.insertBefore @player.rootElement, @iframeContainer.lastElementChild
  open: ->
    utils_1.scrollDisabler.disable()
    @rootElement.style.zIndex = (utils_1.returnHighestZIndex() + 1).toString()
    @rootElement.classList.add 'gobi-popup--active'
    window.addEventListener 'keyup', @_onKeyUp.bind @
    @_listenerRemoveFunctions.push =>
      window.removeEventListener 'keyup', @_onKeyUp.bind @
    @_isOpen = true
  _onKeyUp: (event) ->
    @close() if event.key in ['Escape', 'Esc'] or event.keyCode is 27
  close: ->
    @rootElement.style.zIndex = ''
    @rootElement.classList.remove 'gobi-popup--active'
    @rootElement.style.padding = ''
    utils_1.scrollDisabler.enable()
    @_removeListeners()
    @player.pause()
    @_isOpen = false
  _removeListeners: ->
    i = @_listenerRemoveFunctions.length
    while i--
      @_listenerRemoveFunctions[i]()
  _createTemplate: ->
    closeButton = document.createElement('button')
    closeButton.className = 'gobi-popup__close-btn'
    closeButton.addEventListener 'click', => @close()
    @_calculatePlayerSize()
    @iframeContainer.appendChild closeButton
    @content.appendChild @iframeContainer
    @rootElement.classList.add 'gobi-popup'
    @rootElement.appendChild @content
    window.addEventListener 'resize', => @_calculatePlayerSize()
  _calculatePlayerSize: ->
    videoAspectRatio = 0.5625
    # 9:16
    containerHeight = window.innerHeight - 100
    containerWidth = window.innerWidth
    containerAspectRatio = containerWidth / containerHeight
    width = undefined
    height = undefined
    if videoAspectRatio < containerAspectRatio
      width = containerHeight * videoAspectRatio
      height = containerHeight
    else
      width = containerWidth
      height = containerWidth / videoAspectRatio
    @iframeContainer.style.width = width + 'px'
    @iframeContainer.style.height = height + 'px'

module.exports = Popup
