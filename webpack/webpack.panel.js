var path = require('path');

module.exports = {
    entry: './src/panel/main.js',
    output: {
        path: path.resolve(__dirname, '../panel-dist'),
        filename: 'index.js'
    }
}