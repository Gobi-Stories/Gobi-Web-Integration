'use strict'
Object.defineProperty exports, '__esModule', value: true
tslib_1 = require('tslib')
utils_1 = require('@/utils/utils')
abstract_story_1 = tslib_1.__importDefault(require('@/Story/abstract-story'))
Story = ((_super) ->
  `var Story`

  Story = (options) ->
    _this = _super.call(this, options) or this
    _this._selected = false
    if options.titleColor
      _this._elems.title.style.color = options.titleColor
    if options.descriptionColor
      _this._elems.description.style.color = options.descriptionColor
    if options.titleSize
      _this._elems.title.style.fontSize = options.titleSize
    if options.descriptionSize
      _this._elems.description.style.fontSize = options.descriptionSize
    if options.avatarSize
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
      css += '    width: calc(1.2 * ' + s + '); // compute from bubble size'
      css += '    margin: 0px calc(.1*' + s + ');'
      css += '  }'
      css += '}'
      hoverStyle = document.createElement('style')
      hoverStyle.appendChild document.createTextNode(css)
      document.getElementsByTagName('head')[0].appendChild hoverStyle
    _this._selected = ! !options.selected
    _this.title = _this._title
    _this.description = _this._description
    _this.color = _this._color
    _this

  tslib_1.__extends Story, _super
  Object.defineProperty Story.prototype, 'selected',
    get: ->
      @_selected
    set: (selected) ->
      if selected
        @rootElement.classList.add 'gobi-story--selected'
      else
        @rootElement.classList.remove 'gobi-story--selected'
      @_selected = selected
      return
    enumerable: true
    configurable: true
  Object.defineProperty Story.prototype, 'title',
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
      return
    enumerable: true
    configurable: true
  Object.defineProperty Story.prototype, 'description',
    get: ->
      @_description
    set: (description) ->
      @_description = description
      @_elems.description.textContent = description
      return
    enumerable: true
    configurable: true
  Object.defineProperty Story.prototype, 'color',
    get: ->
      @_color
    set: (color) ->
      @_color = color
      @_elems.avatarContainer.style.borderColor = color
      return
    enumerable: true
    configurable: true

  Story::_createTemplate = ->
    # "desktop": const classPrefix = 'gobi-story';
    classPrefix = 'gobi-popup-story'
    container = document.createElement('div')
    container.classList.add classPrefix
    container.innerHTML = Story._HTML
    utils_1.addPrefixToClassName container.querySelectorAll('*'), classPrefix + '__'
    container

  Object.defineProperty Story, '_HTML',
    get: ->
      '<div class="avatar-container" data-select-area data-avatarContainer><div class="avatar" data-avatar></div></div>' + '<a class="title" target="_blank" data-title></a>' + '<div class="description"><div class="description-text" data-description></div></div>'
    enumerable: true
    configurable: true
  Story
)(abstract_story_1.default)
exports.default = Story
