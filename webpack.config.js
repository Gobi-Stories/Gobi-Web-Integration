const path = require('path');
const { CheckerPlugin } = require('awesome-typescript-loader');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");


const devMode = process.env.NODE_ENV !== 'production';
module.exports = {
    mode: devMode ? 'development' : 'production',
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'gobi-web-integration.js',
        library: 'gobi',
        libraryTarget: 'umd'
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        host: '0.0.0.0',
        port: 9000
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        alias: {
            '@': path.resolve(__dirname, 'src/'),
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader',
                options: {
                    useCache: true,
                    useBabel: true,
                    babelOptions: {
                        babelrc: false, /* Important line */
                        presets: [
                            ["@babel/preset-env", {
                                "targets": "last 2 versions, ie 11",
                                "modules": false
                            }],
                        ],
                        plugins: ["@babel/plugin-transform-object-assign"]
                    },
                    "babelCore": "@babel/core", // needed for Bab
                }
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: devMode ? 'style-loader' : MiniCssExtractPlugin.loader
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: devMode
                        }
                    }, {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                autoprefixer({
                                    browsers: ['> 0.01%', 'last 2 version']
                                })
                            ],
                            sourceMap: devMode
                        }
                    }, {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: devMode
                        }
                    }
                ]
            }
        ]
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                sourceMap: devMode // set to true if you want JS source maps
            }),
            new OptimizeCSSAssetsPlugin({})
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CheckerPlugin(),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "gobi-web-integration.css"
        }),
        new HtmlWebpackPlugin({
            template: 'index.html'
        })
    ]
};
