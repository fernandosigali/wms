const path = require('path');

module.exports = {
    target: 'node',
    entry: './frontend/public/src/js/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'frontend/public/dist')
    },
    watch: true,
    watchOptions: {
        ignored: "**/node_modules"
    }
}