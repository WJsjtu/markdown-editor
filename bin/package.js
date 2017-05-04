const path = require("path");
const constants = require("./../constants");
const packager = require('electron-packager');
const info = require(path.join(constants.APP_PATH, "package.json"));

packager({
    dir: constants.APP_PATH,
    appVersion: info.version,
    arch: "all",
    asar: true,
    electronVersion: require("electron/package.json").version,
    name: info.name.replace(/_/ig, " "),
    out: constants.BUILD_PATH,
    overwrite: true
}, (err, appPaths) => {
});