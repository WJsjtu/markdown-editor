const fs = require('fs');
const path = require('path');

const ipcMessages = {
    editor: {
        file: {
            openStart: true,
            openError: true,
            openSuccess: true,
            exportStart: true,
            exportError: true,
            exportSuccess: true,
        },
        doc: {
            scroll: true,
            change: true,
            preview: true,
            exportHTML: true
        }
    }
};

const traverse = (object, list = []) => {
    for (let prop in object) {
        if (!object.hasOwnProperty(prop)) continue;
        if (typeof object[prop] === 'object') {
            traverse(object[prop], list.concat([prop]));
        } else if (object[prop] === true) {
            object[prop] = list.concat([prop]).join('.');
        }
    }
};

traverse(ipcMessages);

fs.writeFile(path.join(__dirname, 'ipcMessages.js'), `module.exports = ${JSON.stringify(ipcMessages)};`, 'utf8');