const electron = require("electron");

class Editor {

    constructor(title, path, content, parentElement) {
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
        parentElement.appendChild(this.element);
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

module.exports = Editor;