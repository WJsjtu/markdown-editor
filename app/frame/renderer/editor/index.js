const electron = require("electron");
const path = require("path");

const React = require('react');
const ReactDOM = require('react-dom');

const ipcMessages = require("../../../frame/constants/ipcMessages");
const constants = require("./../../../constants");
const loading = require("./loading");


if (process.env.NODE_ENV === "development") {
    window.addEventListener("contextmenu", (event) => {
        electron.remote.getCurrentWindow().inspectElement(event.x, event.y);
    });
}

electron.webFrame.setVisualZoomLevelLimits(1, 1);

loading.show("Initializing editor ...");

const UrlFromPath = require("../../utils/UrlFromPath");

const viewer = require("./createViewer")(
    UrlFromPath(path.resolve(constants.VIEW_PATH, "preview.html")),
    UrlFromPath(path.resolve(constants.VIEW_PATH, "preview_preload.js"))
);


require("./loadMonaco")(
    UrlFromPath(path.resolve(constants.LID_PATH, "monaco/min")),
    () => {

        loading.hide();

        electron.ipcRenderer.on(ipcMessages.editor.file.openStart, () => {
            loading.show("Opening file ...");
        });

        electron.ipcRenderer.on(ipcMessages.editor.file.openError, () => {
            loading.hide();
        });


        const webApp = require("./../../../dist/renderer/app");

        ReactDOM.render(React.createElement(webApp.Root, {}), document.getElementById("tabs"));

        const $editor = document.getElementById("editor");

        electron.ipcRenderer.on(ipcMessages.editor.file.openSuccess, (event, info) => {

            loading.hide();

            const editor = new webApp.Editor(info.path, path.basename(info.path), info.content, $editor);

            editor.on('change', (content) => {
                electron.ipcRenderer.send(ipcMessages.editor.doc.change, {
                    id: editor.id,
                    content: content
                });
            });

            editor.on('activate', (content) => {
                electron.ipcRenderer.send(ipcMessages.editor.doc.change, {
                    id: editor.id,
                    content: content
                });
            });

            editor.activate();
        });

    }
);