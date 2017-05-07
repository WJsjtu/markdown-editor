const electron = require('electron');
const ipcMessages = require('../frame/constants/ipcMessages');

if (process.env.NODE_ENV === 'development') {
    window.__devtron = {require: require, process: process};
}

window.getRenderedHtml = () => {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(document.getElementById('preview'));
    selection.removeAllRanges();
    selection.addRange(range);

    let tryTimeLimit = 4;

    while (!document.execCommand('copy')) tryTimeLimit--;

    const html = electron.clipboard.readHTML();
    selection.removeAllRanges();

    setTimeout(() => {
        electron.ipcRenderer.send(ipcMessages.editor.doc.exportHTML, html);
        electron.clipboard.clear();
    }, 100);
};