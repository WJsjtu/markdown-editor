const electron = require("electron");
const path = require("path");
const constants = require("./../../../constants");
const Editor = require("./editor");
const loading = require("./loading");

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

        window.addEventListener("resize", () => {
            if (Editor.activeEditor) {
                Editor.activeEditor.editor.layout();
            }
        });

        electron.ipcRenderer.on("markdown.preview.update", (event, editor) => {
            for (let i = 0; i < Editor.EditorInstances.length; i++) {
                if (Editor.EditorInstances[i].id === editor.id) {
                    Editor.EditorInstances[i].preview = editor.preview;
                }
            }
        });

        electron.ipcRenderer.on("markdown.file.open.start", () => {
            loading.show("Opening file ...");
        });

        electron.ipcRenderer.on("markdown.file.open.end", () => {
            loading.hide();
        });


        const updateTabBar = () => {
            window.tabs.getTabBar(document.getElementById("tabs"), {
                tabs: Editor.EditorInstances,
                activeID: Editor.activeEditor ? Editor.activeEditor.id : 0,
                onTabClick: onTabClick,
                onTabClose: onTabClose
            });
        };

        const onTabClick = (editor) => {
            editor.activate();
            updateTabBar();
        };

        const onTabClose = (editor) => {
            editor.dispose();
            if (Editor.activeEditor === editor) {

                const changeActiveEditor = () => {
                    if (Editor.EditorInstances.length) {
                        Editor.activeEditor = Editor.EditorInstances[Editor.EditorInstances.length - 1];
                        Editor.activeEditor.activate();
                    }
                };

                if (editor.modified) {

                }
                changeActiveEditor();
            }
            updateTabBar();
        };

        electron.ipcRenderer.on("markdown.editor.create", (event, info) => {
            const editor = new Editor(
                path.basename(info.path),
                info.path,
                info.content,
                document.getElementById("editor")
            );
            editor.activate();
            updateTabBar();
        });
    }
);