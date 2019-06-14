'use strict'
Object.defineProperty exports, '__esModule', value: true
SimpleEventEmitter = do ->
  `var SimpleEventEmitter`

  SimpleEventEmitter = ->
    @_eventsCallbacks = {}
    return

  SimpleEventEmitter::on = (eventName, callback) ->
    if !@_eventsCallbacks.hasOwnProperty(eventName)
      @_eventsCallbacks[eventName] = []
    listeners = @_eventsCallbacks[eventName]
    if listeners.indexOf(callback) == -1
      listeners.push callback
    return

  SimpleEventEmitter::off = (eventName, callback) ->
    if typeof eventName == 'string'
      if @_eventsCallbacks.hasOwnProperty(eventName)
        if typeof callback == 'function'
          @_removeCallback eventName, callback
        else
          @_eventsCallbacks[eventName] = []
    else
      @_removeAllCallbacks()
    return

  SimpleEventEmitter::emit = (eventName, eventData, _this) ->
    if !@_eventsCallbacks.hasOwnProperty(eventName)
      return
    stack = @_eventsCallbacks[eventName]
    stackLength = stack.length
    i = 0
    while i < stackLength
      stack[i].call _this or this, eventData
      i++
    return

  SimpleEventEmitter::_removeCallback = (eventName, callback) ->
    stack = @_eventsCallbacks[eventName]
    callbackInd = stack.indexOf(callback)
    if callbackInd > -1
      stack.splice callbackInd, 1
    return

  SimpleEventEmitter::_removeAllCallbacks = ->
    for key of @_eventsCallbacks
      if @_eventsCallbacks.hasOwnProperty(key)
        delete @_eventsCallbacks[key]
    return

  SimpleEventEmitter
exports.default = SimpleEventEmitter
