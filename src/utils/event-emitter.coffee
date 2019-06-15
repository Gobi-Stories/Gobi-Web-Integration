class SimpleEventEmitter
  constructor: ->
    @_eventsCallbacks = {}
  on: (eventName, callback) ->
    if not @_eventsCallbacks.hasOwnProperty eventName
      @_eventsCallbacks[eventName] = []
    listeners = @_eventsCallbacks[eventName]
    if listeners.indexOf(callback) == -1
      listeners.push callback
  off: (eventName, callback) ->
    if typeof eventName == 'string'
      if @_eventsCallbacks.hasOwnProperty eventName
        if typeof callback == 'function'
          @_removeCallback eventName, callback
        else
          @_eventsCallbacks[eventName] = []
    else
      @_removeAllCallbacks()
  emit: (eventName, eventData, _this) ->
    return unless @_eventsCallbacks.hasOwnProperty eventName
    stack = @_eventsCallbacks[eventName]
    stackLength = stack.length
    i = 0
    while i < stackLength
      stack[i].call _this or this, eventData
      i++
  _removeCallback: (eventName, callback) ->
    stack = @_eventsCallbacks[eventName]
    callbackInd = stack.indexOf(callback)
    if callbackInd > -1
      stack.splice callbackInd, 1
  _removeAllCallbacks: ->
    for key of @_eventsCallbacks
      if @_eventsCallbacks.hasOwnProperty(key)
        delete @_eventsCallbacks[key]

module.exports = SimpleEventEmitter
