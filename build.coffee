#!/usr/bin/env coffee
webpack = require 'webpack'
webpackConfigObject = require './webpack.config.coffee'
webpack webpackConfigObject, (err, stats) ->
  console.log 'Done!' unless err or stats.hasErrors()
  if err
    console.error err
  if stats.hasErrors()
    console.error stats.compilation.errors
