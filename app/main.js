const electron = require('electron');
const app = electron.app;

if (/--debug/.test(process.argv[2])) {
    process.env.NODE_ENV = 'development';
}

// Handle Squirrel on Windows startup events
switch (process.argv[1]) {
    case '--squirrel-install':
        app.quit();
        break;
    case '--squirrel-uninstall':
        app.quit();
        break;
    case '--squirrel-obsolete':
    case '--squirrel-updated':
        app.quit();
        break;
    default:
        require('./frame/main/index');
}
