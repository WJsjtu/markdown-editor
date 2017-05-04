const path = require("path");

/**
 * Change local file path into url.
 * @param _path {string}
 * @return {string}
 */
module.exports = (_path) => {
    let pathName = path.resolve(_path).replace(/\\/g, "/");
    if (pathName.length > 0 && pathName.charAt(0) !== "/") {
        pathName = "/" + pathName;
    }
    return encodeURI("file://" + pathName);
};