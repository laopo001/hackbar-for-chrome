var path = require('path');

module.exports = {
    entry: './src/popup/main.js',
    output: {
        path: path.resolve(__dirname, '../popup-dist'),
        filename: 'index.js'
    }
}