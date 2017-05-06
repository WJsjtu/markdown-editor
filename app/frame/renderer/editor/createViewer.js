const electron = require("electron");

const ipcMessages = require("../../../frame/constants/ipcMessages");
const loading = require("./loading");

/**
 *
 * @param previewTemplateUrl {string}
 * @param previewPreloadJsUrl {string}
 * @return {*}
 */
module.exports = (previewTemplateUrl, previewPreloadJsUrl) => {

    const preview = document.getElementById("preview");

    if (!preview) return false;

    preview.innerHTML = `<webview id="viewer" src="${previewTemplateUrl}" preload='${previewPreloadJsUrl}' disableguestresize autosize></webview>`;

    const viewer = document.getElementById('viewer');

    const updateLayout = () => {
        viewer.style.height = parseFloat(window.getComputedStyle(preview, null).height, 10) + "px";
    };

    updateLayout();

    window.addEventListener("resize", updateLayout);

    viewer.addEventListener('dom-ready', () => {

        if (process.env.NODE_ENV === "development") {
            viewer.addEventListener("contextmenu", (event) => {
                event.stopPropagation();
                viewer.openDevTools();
            });
        }

        electron.ipcRenderer.on(ipcMessages.editor.doc.preview, (event, editor) => {
            viewer.executeJavaScript(`updatePreview(${JSON.stringify(editor.preview)})`);
        });

        electron.ipcRenderer.on(ipcMessages.editor.file.exportStart, (event) => {
            loading.show("Exporting file ...");
            viewer.executeJavaScript(`getRenderedHtml()`);
        });

        electron.ipcRenderer.on(ipcMessages.editor.file.exportError, (event) => {
            loading.hide();
        });

        electron.ipcRenderer.on(ipcMessages.editor.file.exportSuccess, (event) => {
            loading.hide();
        });

    });

    return viewer;
};