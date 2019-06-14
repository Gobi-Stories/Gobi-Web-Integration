'use strict'
Object.defineProperty exports, '__esModule', value: true
tslib_1 = require('tslib')
utils_1 = require('@/utils/utils')
event_emitter_1 = tslib_1.__importDefault(require('@/utils/event-emitter'))
# Popup is the overlay that contains the iframe with the Gobi Player.
# The overlay is a half-transparent black fullpage background.
# Popup puts a close X button on the player, adds an Escape button listener, and also quits if
# the background overlay is clicked.
# Popup does not contain the player itself, it only shows it using an iframe.
# Classes for this component start with gobi-popup__.
# The other components are not part of this popup, and thus should be renamed from
# gobi-popup-* to gobi-storyset-*, or something else.
Popup = do ->
  `var Popup`

  Popup = (options) ->
    @_isOpen = false
    @_defaultOptions =
      classes: ''
      openers: ''
    @_eventEmitter = new (event_emitter_1.default)
    @_listenerRemoveFunctions = []
    _options = Object.assign({}, @_defaultOptions, options)
    @rootElement = document.createElement('div')
    @rootElement.className = _options.classes or ''
    @content = document.createElement('div')
    @content.className = 'gobi-popup__content'
    @iframeContainer = document.createElement('div')
    @iframeContainer.className = 'gobi-popup__iframe-container'
    @_createTemplate()
    @player = _options.player
    @appendPlayer @player
    @rootElement.addEventListener 'click', @_onDirectClickClose.bind(this)
    @content.addEventListener 'click', @_onDirectClickClose.bind(this)
    return

  Object.defineProperty Popup.prototype, 'isOpen',
    get: ->
      @_isOpen
    enumerable: true
    configurable: true

  Popup::appendPlayer = (player) ->
    @player = player
    @iframeContainer.insertBefore @player.rootElement, @iframeContainer.lastElementChild
    return

  Popup::open = ->
    _this = this
    utils_1.scrollDisabler.disable()
    @rootElement.style.zIndex = (utils_1.returnHighestZIndex() + 1).toString()
    @rootElement.classList.add 'gobi-popup--active'
    window.addEventListener 'keyup', @_onEscapeClose.bind(this)
    @_listenerRemoveFunctions.push ->
      window.removeEventListener 'keyup', _this._onEscapeClose.bind(_this)
    @_isOpen = true
    @_eventEmitter.emit 'open', this, this
    return

  Popup::close = ->
    @rootElement.style.zIndex = ''
    @rootElement.classList.remove 'gobi-popup--active'
    @rootElement.style.padding = ''
    utils_1.scrollDisabler.enable()
    @_removeListeners()
    @player.pause()
    @_isOpen = false
    @_eventEmitter.emit 'close', this, this
    return

  Popup::on = (eventName, callback) ->
    @_eventEmitter.on eventName, callback
    return

  Popup::off = (eventName, callback) ->
    @_eventEmitter.off eventName, callback
    return

  Popup::_removeListeners = ->
    i = @_listenerRemoveFunctions.length
    while i--
      @_listenerRemoveFunctions[i]()
    return

  Popup::_createTemplate = ->
    closeButton = document.createElement('button')
    closeButton.className = 'gobi-popup__close-btn'
    closeButton.addEventListener 'click', @close.bind(this)
    @_calculatePlayerSize()
    @iframeContainer.appendChild closeButton
    @content.appendChild @iframeContainer
    @rootElement.classList.add 'gobi-popup'
    @rootElement.appendChild @content
    window.addEventListener 'resize', @_calculatePlayerSize.bind(this)
    return

  Popup::_onDirectClickClose = (event) ->
    # currentTarget is element that the event listener was attached to.
    # target is the child-most element clicked
    if event.target == event.currentTarget
      @close()
    return

  Popup::_onEscapeClose = (event) ->
    isEscape = false
    if typeof event.key != 'undefined'
      isEscape = 'Escape' == event.key or 'Esc' == event.key
    else
      isEscape = event.keyCode == 27
    if isEscape
      @close()
    return

  Popup::_calculatePlayerSize = ->
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
    return

  Popup
exports.default = Popup
