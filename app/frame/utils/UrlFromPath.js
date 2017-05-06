const url = require("url");

/**
 * Change local file path into url.
 * @param localPath {string}
 * @return {string}
 */
module.exports = (localPath) => {
    return url.format({
        pathname: localPath,
        protocol: "file:",
        slashes: true
    })
};