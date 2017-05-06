const electron = require("electron");
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

        electron.ipcRenderer.on("markdown.preview.update", (event, editor) => {
            viewer.executeJavaScript(`updatePreview(${JSON.stringify(editor.preview)})`);
        });

        electron.ipcRenderer.on("markdown.preview.crash", (event) => {
            viewer.executeJavaScript(`updatePreview("Markdown 解析器奔溃了……，请重试！")`);
        });

        electron.ipcRenderer.on("markdown.file.export.start", (event) => {

            loading.show("Exporting file ...");

            viewer.printToPDF({
                pageSize: "A4",
                printBackground: true
            }, (error, data) => {
                if (!error) {
                    electron.ipcRenderer.send("markdown.file.export.generate.success", data);
                } else {
                    electron.ipcRenderer.send("markdown.file.export.generate.fail");
                }
            });
        });

        electron.ipcRenderer.on("markdown.file.export.end", (event) => {
            loading.hide();
        });

    });

    return viewer;
};