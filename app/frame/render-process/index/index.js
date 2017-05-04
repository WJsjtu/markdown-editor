const electron = require("electron");
const path = require("path");
const loading = require("./loading");

const APP_PATH = path.resolve(__dirname, "..", "..", "..");

electron.webFrame.setVisualZoomLevelLimits(1, 1);

loading.show("Initializing editor ...");

const UriFromPath = require("./../../utils/UriFromPath");

const viewer = require("./createViewer")(
    UriFromPath(path.resolve(APP_PATH, "views/preview.html")),
    UriFromPath(path.resolve(APP_PATH, "views/preview_preload.js"))
);


require("./loadMonaco")(
    UriFromPath(path.resolve(APP_PATH, "lib/monaco/min")),
    () => {
        loading.hide();

        class Editor {

            constructor(title, path, content) {
                this.id = Editor.generateID();
                this.title = title;
                this.path = path;
                this.content = content;
                this.rawContent = content;
                this.preview = "";
                this.modified = false;
                this.element = document.createElement("div");
                this.element.style.height = "100%";
                this.element.style.width = "100%";
                this.element.style.display = "none";
                document.getElementById("editor").appendChild(this.element);
                this.editor = monaco.editor.create(this.element, {
                    value: this.content,
                    language: "markdown",
                    theme: "vs-dark"
                });


                this.editor.onDidChangeModelContent(() => {
                    this.content = this.editor.model.getValue();
                    if (this.content !== this.rawContent) this.modified = true;
                    if (this === Editor.activeEditor) {
                        electron.ipcRenderer.send("markdown.editor.change", {
                            id: this.id,
                            content: this.content
                        });
                    }
                });

                electron.ipcRenderer.send("markdown.editor.change", {
                    id: this.id,
                    content: this.content
                });

                Editor.EditorInstances.push(this);
            }

            activate() {
                if (Editor.activeEditor) {
                    Editor.activeEditor.element.style.display = "none";
                }
                Editor.activeEditor = this;
                this.element.style.display = "block";
                this.editor.layout();

                electron.ipcRenderer.send("markdown.editor.change", {
                    id: this.id,
                    content: this.content
                });
            }

            dispose() {

                const index = Editor.EditorInstances.indexOf(this);
                if (index !== -1) {
                    Editor.EditorInstances.splice(index, 1);
                }
                this.editor.dispose();
                this.element.remove();
            }
        }


        Editor.EditorInstances = [];
        Editor.activeEditor = null;
        Editor.generateID = (() => {
            const IDs = [];
            return () => {
                let id;
                do {
                    id = ("" + Math.random()).replace("0.", "$.");
                } while (IDs[id]);
                return id;
            };
        })();

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
            window.browser.getTabBar(document.getElementById("tabs"), {
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
            const editor = new Editor(path.basename(info.path), info.path, info.content);
            editor.activate();
            updateTabBar();
        });
    }
);