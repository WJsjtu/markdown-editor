const path = require("path");

module.exports = {
    APP_PATH: path.join(__dirname, "app"),
    NODE_PATH: path.join(__dirname, "node_modules"),
    SOURCE_PATH: path.join(__dirname, "src"),
    DIST_PATH: path.join(__dirname, "app", "dist"),
    CLIENT_PATH: path.join(__dirname, "app", "frame", "main-process"),
    BUILD_PATH: path.join(__dirname, "build")
};