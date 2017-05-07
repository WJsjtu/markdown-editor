const path = require('path');

module.exports = {
    ROOT_PATH: __dirname,
    APP_PATH: path.join(__dirname, 'app'),
    NODE_PATH: path.join(__dirname, 'node_modules'),
    SOURCE_PATH: path.join(__dirname, 'src'),
    DIST_PATH: path.join(__dirname, 'app', 'dist'),
    BUILD_PATH: path.join(__dirname, 'build')
};