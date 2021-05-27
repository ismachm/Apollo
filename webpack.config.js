const webpack = require("webpack");
module.exports = {
    plugins: [
        new webpack.ExternalsPlugin('commonjs', [
            'electron'
        ])
    ],
    target: 'electron-renderer',
    disableHostCheck: true
}