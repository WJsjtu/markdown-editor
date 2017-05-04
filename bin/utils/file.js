const fs = require("fs");
const path = require("path");

const directoryDelimiter = path.delimiter === ":" ? "/" : "\\";

/**
 *
 * @param folderPath {string}
 */
const removeDirectory = function (folderPath) {
    if (fs.existsSync(folderPath)) {
        const files = fs.readdirSync(folderPath);
        files.forEach(function (file) {
            var curPath = path.join(folderPath, file);
            if (fs.statSync(curPath).isDirectory()) {
                removeDirectory(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(folderPath);
    }
};

/**
 *
 * @param dirPath {string}
 */
const makeDirectory = (dirPath) => {

    if (!dirPath || typeof dirPath !== 'string' || fs.existsSync(dirPath)) return;

    dirPath = dirPath.trimRight(directoryDelimiter);

    const pathArray = dirPath.split(directoryDelimiter);

    let currentPath = pathArray[0] + directoryDelimiter;

    for (let i = 1, l = pathArray.length; i < l; i++) {
        if (!fs.existsSync(currentPath)) {
            fs.mkdirSync(currentPath);
        }
        currentPath = path.join(currentPath, pathArray[i]) + directoryDelimiter;
    }
    if (!fs.existsSync(currentPath)) {
        fs.mkdirSync(currentPath);
    }
};

/**
 *
 * @param src {string}
 * @param dst {string}
 */
const copyFile = (src, dst) => {
    if (!fs.existsSync(path.dirname(dst))) makeDirectory(path.dirname(dst));
    fs.createReadStream(src).pipe(fs.createWriteStream(dst));
};

/**
 *
 * @param src {string}
 * @param dst {string}
 * @param callback {function}
 */
const exists = (src, dst, callback)=> {
    fs.exists(dst, (exists) => {
        exists ? callback(src, dst) : fs.mkdir(dst, () => callback(src, dst));
    });
};

/**
 *
 * @param src {string}
 * @param dst {string}
 */
const copyDirectory = (src, dst) => {

    if (!fs.existsSync(dst)) makeDirectory(dst);

    fs.readdir(src, function (err, paths) {

        if (err) throw err;

        paths.forEach((childPath) => {

            const childSrc = path.join(src, childPath), childDst = path.join(dst, childPath);

            fs.stat(childSrc, (childErr, childStat) => {

                if (childErr) {
                    console.log(childErr);
                } else {

                    if (childStat.isFile()) {
                        copyFile(childSrc, childDst);
                    } else if (childStat.isDirectory()) {
                        exists(childSrc, childDst, copyDirectory);
                    }
                }

            });
        });
    });
};


module.exports = {
    copy: (src, dst) => {
        fs.stat(src, (err, stat) => {
            if (err) {
                console.log(err);
            } else {
                if (stat.isFile()) {
                    copyFile(src, dst);
                } else if (stat.isDirectory()) {
                    exists(src, dst, copyDirectory);
                }
            }
        });

    },
    copyFile: copyFile,
    removeDirectory: removeDirectory,
    makeDirectory: makeDirectory,
    copyDirectory: copyDirectory
};
