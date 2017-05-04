const fs = require("fs");
const markdown = require("./../../dist/node/markdown");

/**
 *
 * @param mainWindow {object}
 * @param filePath {string}
 */
module.exports = (mainWindow, filePath) => {
    mainWindow.webContents.send("markdown.file.open.start");
    if (fs.existsSync(filePath)) {
        const stat = fs.statSync(filePath);
        if (stat.isFile()) {
            fs.readFile(filePath, "utf-8", (err, content) => {
                mainWindow.webContents.send("markdown.editor.create", {
                    path: filePath,
                    content: content
                });
                mainWindow.webContents.send("markdown.file.open.end");
            });
        } else {
            mainWindow.webContents.send("markdown.file.open.end");
        }
    }
};