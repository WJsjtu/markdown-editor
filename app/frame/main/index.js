const electron = require('electron');
const {app} = electron;
const constants = require('../../constants');
const path = require('path');

const EditorWindow = require('./windows/editor');

process.on('uncaughtException', console.log.bind(console));

let mainWindow = null;

/**
 * Make this app a single instance app.
 * The main window will be restored and focused instead of a second window
 * opened when a person attempts to launch a second instance.
 *
 * Returns true if the current version of the app should quit instead of launching.
 * @return {bool}
 */
const makeSingleInstance = () => {
    if (process.mas) return false;

    return app.makeSingleInstance(()=> {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
        }
    })
};

if (makeSingleInstance()) return app.quit();

app.on('ready', () => {
    mainWindow = (new EditorWindow()).window;
});

app.on('window-all-closed', () => {
    mainWindow = null;
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (mainWindow === null) mainWindow = (new EditorWindow()).window;
});