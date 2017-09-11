var path = require('path');
var webpackMerge = require('webpack-merge');
var panalConfig = require('./webpack/webpack.panel')
var popupConfig = require('./webpack/webpack.popup')
var commonConfig = require('./webpack/webpack.common')

module.exports = function (options, webpackOptions) {
    options = options || {};
    let configs = [];
    if (options.panel) {
        configs.push(webpackMerge({}, panalConfig, commonConfig));
    }
    if (options.popup) {
        configs.push(webpackMerge({}, popupConfig, commonConfig));
    }
    return configs;
}

