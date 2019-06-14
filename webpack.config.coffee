path = require('path')
MiniCssExtractPlugin = require('mini-css-extract-plugin')
autoprefixer = require('autoprefixer')
CleanWebpackPlugin = require('clean-webpack-plugin')
OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

developmentMode = process.env.NODE_ENV != 'production'
module.exports =
  mode: if developmentMode then 'development' else 'production'
  entry: './src/index.coffee'
  output:
    path: path.resolve(__dirname, 'dist')
    filename: 'index.js'
    library: 'gobi'
    libraryTarget: 'umd'
  devServer:
    contentBase: path.join(__dirname, 'dist')
    host: '0.0.0.0'
    port: 9000
  resolve:
    modules: [
      path.resolve(__dirname, 'src')
      'node_modules'
    ]
    extensions: ['*', '.coffee', '.js', '.jsx', '.styl']
    alias: '@': path.resolve(__dirname, 'src/')
  module: rules: [
    {
      test: /\.coffee$/
      use: [
        {
          loader: 'babel-loader'
          options:
            cacheDirectory: true
            env:
              'development': comments: false
              'production':
                comments: false
                minified: true
        }
        { loader: 'coffee-loader' }
      ]
    }
    {
      test: /\.styl$/
      use: [
        { loader: if developmentMode then 'style-loader' else MiniCssExtractPlugin.loader }
        {
          loader: 'css-loader'
          options: sourceMap: developmentMode
        }
        {
          loader: 'postcss-loader'
          options:
            plugins: [ autoprefixer(browsers: [
              '> 0.01%'
              'last 2 version'
            ]) ]
            sourceMap: developmentMode
        }
        {
          loader: 'stylus-loader'
          options: sourceMap: developmentMode
        }
      ]
    }
  ]
  optimization: minimizer: [ new OptimizeCSSAssetsPlugin({}) ]
  plugins: [
    new CleanWebpackPlugin
    new MiniCssExtractPlugin(filename: 'index.css')
  ]
