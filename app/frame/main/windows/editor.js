const fs = require('fs');
const path = require('path');
const electron = require('electron');
const {app, dialog, BrowserWindow, Menu} = electron;

const constants = require('../../../constants');
const markdown = require('../../../dist/main/markdown');
const ipcMessages = require('../../constants/ipcMessages');
const UrlFromPath = require('../../utils/UrlFromPath');

class EditorWindow {

    /**
     *
     * @param window
     */
    set window(window) {
        this._window = window;
    }

    /**
     *
     * @return {*}
     */
    get window() {
        return this._window;
    }

    /**
     *
     * @param responsive
     */
    set responsive(responsive) {
        this._responsive = responsive;
    }

    /**
     *
     * @return {*}
     */
    get responsive() {
        return this._responsive;
    }


    constructor() {

        const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize;

        this.responsive = false;

        this._onMenuFileOpen = this._onMenuFileOpen.bind(this);
        this._onMenuFileExportHTML = this._onMenuFileExportHTML.bind(this);

        this.window = new BrowserWindow({
            width: width,
            minWidth: width,
            height: height,
            minHeight: height,
            backgroundColor: '#ffffff',
            title: 'Markdown Editor',
            show: false
        });


        this.window.once('ready-to-show', () => {
            this.window.show();
            this.responsive = true;
            this.updateMenu();
        });

        this.window.on('unresponsive', () => {
            this.window = null;
            this.responsive = false;
            this.updateMenu();
            app.quit();
        });

        this.window.webContents.on('crashed', (event) => {

        });

        this.window.on('close', (event) => {
            //Todo: if there are unsaved modified files.
        });

        this.window.on('closed', () => {
            this.window = null;
            this.responsive = false;
            this.updateMenu();
        });

        this.window.loadURL(UrlFromPath(path.join(constants.VIEW_PATH, 'editor.html')));

        if (process.env.NODE_ENV === 'development') {
            this.window.webContents.openDevTools();
            (function installDevTools() {
                const extensions = BrowserWindow.getDevToolsExtensions();
                if (!extensions['React Developer Tools']) {
                    BrowserWindow.addDevToolsExtension(
                        path.join(constants.APP_PATH, 'extensions', 'react-devtools', '2.1.7_0')
                    );
                }
                require('devtron').install();
            }).call(this);
        }

        this._registerEvents();
    }

    updateMenu() {

        const menuTemplate = [
            {
                label: 'File',
                submenu: [
                    {label: 'Open', click: this._onMenuFileOpen, enabled: this.responsive},
                    {label: 'Save', accelerator: 'CommandOrControl+S', enabled: this.responsive},
                    {type: 'separator'},
                    {label: 'Export to HTML', click: this._onMenuFileExportHTML, enabled: this.responsive}
                ],
            }, {
                label: 'Edit',
                submenu: [
                    {label: 'Copy', accelerator: 'CommandOrControl+C', selector: 'copy:', enabled: this.responsive},
                    {label: 'Paste', accelerator: 'CommandOrControl+V', selector: 'paste:', enabled: this.responsive},
                    {
                        label: 'Select All',
                        accelerator: 'CommandOrControl+A',
                        selector: 'selectAll:',
                        enabled: this.responsive
                    }
                ]
            }
        ];

        if (process.platform === 'darwin') {
            menuTemplate.unshift({
                label: electron.app.getName(),
                submenu: [
                    {role: 'about'},
                    {type: 'separator'},
                    {role: 'window'},
                    {role: 'services', submenu: []},
                    {type: 'separator'},
                    {role: 'quit'}
                ]
            })
        }

        Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));
    }

    _onMenuFileOpen() {
        this.responsive = false;
        this.updateMenu();

        const filePaths = dialog.showOpenDialog({
            filters: [{
                name: 'Markdown Files',
                extensions: ['md', 'MD']
            }],
            properties: ['openFile', 'showHiddenFiles', 'createDirectory', 'promptToCreate', 'noResolveAliases'],
        });
        if (filePaths && filePaths.length) {

            const filePath = filePaths[0];

            this.window.webContents.send(ipcMessages.editor.file.openStart);

            if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {

                const content = fs.readFileSync(filePath, 'utf8');

                if (content) {
                    this.window.webContents.send(ipcMessages.editor.file.openSuccess, {
                        path: filePath,
                        content: content
                    });
                    this.responsive = true;
                    this.updateMenu();
                    return;
                }

            }

            this.window.webContents.send(ipcMessages.editor.file.openError, {
                path: filePath
            });
        }
        this.responsive = true;
        this.updateMenu();
    }

    _onMenuFileExportHTML() {
        this.responsive = false;
        this.updateMenu();

        this.window.webContents.send(ipcMessages.editor.file.exportStart);

        setTimeout(() => {
            if (!this.responsive) {
                this.responsive = true;
                this.updateMenu();
            }
        }, 4000);

    }

    _registerEvents() {

        electron.ipcMain.on(ipcMessages.editor.doc.exportHTML, (event, content) => {
            const targetPath = dialog.showSaveDialog({
                title: 'Exported pdf'
            });

            if (targetPath) {
                const data = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>${path.basename(targetPath)}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
${content}
</body>
</html>`;

                fs.writeFile(targetPath, data, (err) => {
                    this.window.webContents.send(err ? ipcMessages.editor.file.exportError : ipcMessages.editor.file.exportSuccess);
                });
            } else {
                this.window.webContents.send(ipcMessages.editor.file.exportError);
            }
            this.responsive = true;
            this.updateMenu();
        });
    }

}

electron.ipcMain.on(ipcMessages.editor.doc.change, (event, editor) => {
    const preview = markdown(editor.content);
    if (preview) {
        event.sender.send(ipcMessages.editor.doc.preview, {
            id: editor.id,
            preview: preview
        });
    } else {
        event.sender.send(ipcMessages.editor.doc.preview, {
            id: editor.id,
            preview: 'Markdown crashed!'
        });
    }
});

module.exports = EditorWindow;