'use strict';

let path = require('path');
let webpack = require('webpack');

let baseConfig = require('./base');
let defaultSettings = require('./defaults');

// Add needed plugins here
let BowerWebpackPlugin = require('bower-webpack-plugin');
let HtmlWebpackPlugin = require('html-webpack-plugin');

var generateBuildHtmls = function (isSingle, nameList) {
    if (isSingle) {
        return [{
            filename: path.resolve(__dirname, '../dist/index.html'),
            template: 'src/index.html',
            inject: true,
            hash: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
                // more options:
                // https://github.com/kangax/html-minifier#options-quick-reference
            },
            // necessary to consistently work with multiple chunks via CommonsChunkPlugin
            chunksSortMode: 'dependency'
        }];
    }

    return nameList.map(function (name) {
        return {
            filename: path.resolve(__dirname, '../dist/' + name + '.html'),
            template: 'index.html',
            inject: true,
            chunks: [ name, 'vendor', 'manifest' ],
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
            },
            chunksSortMode: 'dependency'
        };
    });
};
var htmlWebpackPlugins = generateBuildHtmls(true).map(function (config) {
    return new HtmlWebpackPlugin(config);
});

let config = Object.assign({}, baseConfig, {
    entry: path.join(__dirname, '../src/index'),
    cache: false,
    //devtool: 'sourcemap',
    plugins: [
        new webpack.optimize.DedupePlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        }),
        new BowerWebpackPlugin({
            searchResolveModulesDirectories: false
        }),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.NoErrorsPlugin()
    ].concat(htmlWebpackPlugins),
    module: defaultSettings.getDefaultModules()
});

// Add needed loaders to the defaults here
config.module.loaders.push({
    test: /\.(js|jsx)$/,
    loader: 'babel',
    include: [].concat(
        config.additionalPaths,
        [ path.join(__dirname, '/../src') ]
    )
});

module.exports = config;
