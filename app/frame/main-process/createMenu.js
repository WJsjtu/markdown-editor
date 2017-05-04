const electron = require('electron');
const openFile = require("./openFile");
const exportToPDF = require("./exportToPDF");

/**
 *
 * @param mainWindow {object}
 */
module.exports = (mainWindow) => {

    const template = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Open',
                    click () {
                        const filePaths = electron.dialog.showOpenDialog({
                            filters: [{
                                name: "Markdown Files",
                                extensions: ["md", "MD"]
                            }],
                            properties: ["openFile", "showHiddenFiles", "createDirectory", "promptToCreate", "noResolveAliases"],
                        });
                        if (filePaths && filePaths.length) {
                            openFile(mainWindow, filePaths[0]);
                        }
                    }
                },
                {label: 'Save'},
                {type: 'separator'},
                {
                    label: 'Export to PDF',
                    click(){
                        exportToPDF(mainWindow);
                    }
                },
                {label: 'Export to HTML'}
            ],
        }, {
            label: "Edit",
            submenu: [
                {label: "Copy", accelerator: "CommandOrControl+C", selector: "copy:"},
                {label: "Paste", accelerator: "CommandOrControl+V", selector: "paste:"},
                {label: "Select All", accelerator: "CommandOrControl+A", selector: "selectAll:"}
            ]
        }
    ];

    if (process.platform === "darwin") {
        template.unshift({
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

    const menu = electron.Menu.buildFromTemplate(template);
    electron.Menu.setApplicationMenu(menu);
};