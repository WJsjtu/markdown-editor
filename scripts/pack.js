const path = require("path");
const fse = require("fs-extra");
const constants = require("./../constants");
const packager = require('electron-packager');
const info = require(path.join(constants.APP_PATH, "package.json"));

fse.emptyDirSync(constants.BUILD_PATH);
fse.outputFileSync(path.join(constants.BUILD_PATH, ".gitkeep"), "");
packager({
    dir: constants.APP_PATH,
    appVersion: info.version,
    arch: "all",
    icon: path.join(constants.APP_PATH, "assets", "app-icon", "app"),
    asar: true,
    electronVersion: require("electron/package.json").version,
    name: info.name.replace(/_/ig, " "),
    out: constants.BUILD_PATH,
    overwrite: true
}, (err, appPaths) => {
});