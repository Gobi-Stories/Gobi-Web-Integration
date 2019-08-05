AbstractStory = require('@/Story/abstract-story')
Function::property = (name, getset) -> Object.defineProperty @prototype, name, getset

class Story extends AbstractStory
  constructor: (options) ->
    super options
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
      @_elems.avatarContainer.style.borderColor = color
  _createTemplate: ->
    # "desktop": const classPrefix = 'gobi-story';
    classPrefix = 'gobi-popup-story'
    container = document.createElement('div')
    container.classList.add 'gobi-popup-story'
    container.innerHTML = '<div class="gobi-popup-story__avatar-container" data-select-area><div class="gobi-popup-story__avatar"></div></div><a class="gobi-popup-story__title" target="_blank"></a><div class="gobi-popup-story__description"><div class="gobi-popup-story__description-text"></div></div>'
    container

module.exports = Story
