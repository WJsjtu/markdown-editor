const path = require("path");
const electron = require("electron");
const {ipcRenderer} = electron;
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

const App = require("./../../../dist/renderer/app").default;
const webApp = new App();
const tabView = webApp.createTabView(document.getElementById("tabs"));
const editorView = webApp.createEditorView(document.getElementById("editor"));

require("./loadMonaco")(UrlFromPath(path.resolve(constants.LID_PATH, "monaco/min")), () => {
    loading.hide();
    ipcRenderer.on(ipcMessages.editor.file.openStart, () => {
        loading.show("Opening file ...");
    });

    ipcRenderer.on(ipcMessages.editor.file.openError, () => {
        loading.hide();
    });

    ipcRenderer.on(ipcMessages.editor.file.openSuccess, (event, info) => {

        loading.hide();

        const file = webApp.store.addFile({
            title: path.basename(info.path),
            path: info.path,
            content: info.content
        });


        ipcRenderer.send(ipcMessages.editor.doc.change, {
            id: file.id,
            content: file.content
        });

        webApp.store.on('change', (id, content) => {
            ipcRenderer.send(ipcMessages.editor.doc.change, {
                id: id,
                content: content
            });
        });

        webApp.store.on('scroll', (id, line) => {
            if (line) {
                viewer.executeJavaScript(`updateScroll(${line})`);
            }
        });

        webApp.store.on('moveToFront', (id, content) => {
            ipcRenderer.send(ipcMessages.editor.doc.change, {
                id: id,
                content: content
            });
        });
    });

});
