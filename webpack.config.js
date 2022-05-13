const path = require('path');

module.exports = {
    entry: './app/public/src/js/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'app/public/dist')
    },
    watch: true,
    watchOptions: {
        ignored: "**/node_modules"
    }
}