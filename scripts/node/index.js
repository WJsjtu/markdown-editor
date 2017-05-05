const path = require("path");
const fs = require("fs");

fs.readdirSync(__dirname).forEach((subPath) => {
    if (subPath !== "index.js" && fs.statSync(path.join(__dirname, subPath)).isFile()) {
        require("./" + subPath);
    }
});