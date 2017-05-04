if (/--debug/.test(process.argv[2])) {
    process.env.NODE_ENV = "development";
}

const path = require("path");
const fs = require("fs");
const electron = require("electron");
const Application = require("./frame/main-process/application");
const UrlFromPath = require("./frame/utils/UriFromPath");


const markdown = require("./dist/node/markdown");

const app = electron.app;

// Handle Squirrel on Windows startup events
switch (process.argv[1]) {
    case "--squirrel-install":
        app.quit();
        break;
    case "--squirrel-uninstall":
        app.quit();
        break;
    case "--squirrel-obsolete":
    case "--squirrel-updated":
        app.quit();
        break;
    default:

        process.on("uncaughtException", console.log.bind(console));

        new Application("Markdown Editor", (application) => {

            if (!application.mainWindow) return;

            application.mainWindow.loadURL(UrlFromPath(path.join(__dirname, "index.html")));

            require("./frame/main-process/createMenu")(application.mainWindow);

            electron.ipcMain.on('markdown.file.export.generate.success', (event, data) => {
                const targetPath = electron.dialog.showSaveDialog({
                    title: "Exported pdf"
                });
                if (targetPath) {
                    fs.writeFile(targetPath, data, (err) => {
                        event.sender.send(err ? "markdown.file.export.save.fail" : "markdown.file.export.save.success");
                        event.sender.send("markdown.file.export.end");
                    });
                } else {
                    event.sender.send("markdown.file.export.end");
                }
            });

            electron.ipcMain.on('markdown.file.export.generate.fail', (event) => {
                event.sender.send("markdown.file.export.end");
            });

        });

        electron.app.on("ready", () => {

            electron.ipcMain.on("markdown.editor.change", (event, editor) => {
                const preview = markdown(editor.content);
                if (preview) {
                    event.sender.send("markdown.preview.update", {
                        id: editor.id,
                        preview: preview
                    });
                } else {
                    event.sender.send("markdown.preview.crash");
                }
            });
        });
}
