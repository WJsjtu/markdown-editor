const electron = require("electron");
const path = require("path");
const constants = require("./../../../constants");
const loading = require("./loading");

if (process.env.NODE_ENV === "development") {
    window.addEventListener("contextmenu", (event) => {
        electron.remote.getCurrentWindow().inspectElement(event.x, event.y);
    });
}

electron.webFrame.setVisualZoomLevelLimits(1, 1);

loading.show("Initializing editor ...");

const UriFromPath = require("./../../utils/UriFromPath");

const viewer = require("./createViewer")(
    UriFromPath(path.resolve(constants.APP_PATH, "views/preview.html")),
    UriFromPath(path.resolve(constants.APP_PATH, "views/preview_preload.js"))
);


require("./loadMonaco")(
    UriFromPath(path.resolve(constants.APP_PATH, "lib/monaco/min")),
    () => {

        loading.hide();

        electron.ipcRenderer.on("markdown.file.open.start", () => {
            loading.show("Opening file ...");
        });

        electron.ipcRenderer.on("markdown.file.open.end", () => {
            loading.hide();
        });


        const webApp = require("./../../../dist/browser/app");

        webApp.render(document.getElementById("tabs"));

        electron.ipcRenderer.on("markdown.editor.create", (event, info) => {
            const editor = new webApp.Editor(info.path, path.basename(info.path), info.content, document.getElementById("editor"));

            editor.on('change', (content) => {
                electron.ipcRenderer.send('markdown.editor.change', {
                    id: editor.id,
                    content: content
                });
            });

            editor.on('activate', (content) => {
                electron.ipcRenderer.send('markdown.editor.change', {
                    id: editor.id,
                    content: content
                });
            });

            editor.activate();
        });
    }
);