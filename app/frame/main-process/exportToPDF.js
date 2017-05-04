module.exports = (mainWindow) => {
    mainWindow.webContents.send("markdown.file.export.start");
};