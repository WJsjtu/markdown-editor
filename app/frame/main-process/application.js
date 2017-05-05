const electron = require("electron");

/**
 * @class
 */
class Application {

    /**
     * @constructor
     * @param name {string}
     * @param callback {function}
     * @return {*}
     */
    constructor(name, callback) {

        if (this.makeSingleInstance()) return electron.app.quit();

        if (process.mas) electron.app.setName(name || "Electron");

        electron.app.on("ready", () => {
            this.createWindow(name, callback);
        });

        electron.app.on("window-all-closed", () => {
            if (process.platform !== "darwin") {
                electron.app.quit();
            }
        });

        electron.app.on("activate", () => {
            if (this.mainWindow === null) {
                this.createWindow(name, callback);
            }
        })
    }

    /**
     * @param name {string}
     * @param callback {function}
     */
    createWindow(name, callback) {

        const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize;

        this.mainWindow = new electron.BrowserWindow({
            width: width,
            minWidth: width,
            height: height,
            minHeight: height,
            title: name
        });


        if (process.env.NODE_ENV === "development") {
            this.mainWindow.webContents.openDevTools();
            this.mainWindow.maximize();
            require("devtron").install();
        }

        this.mainWindow.on("unresponsive", (event) => {
            this.mainWindow = null;
            electron.app.quit();
        });

        this.mainWindow.webContents.on("crashed", (event) => {

        });

        this.mainWindow.on("close", (event)=> {
            //event.preventDefault();
        });

        this.mainWindow.on("closed", ()=> {
            this.mainWindow = null;
        });

        typeof callback === "function" && callback(this);
    }

    /**
     * Make this app a single instance app.
     * The main window will be restored and focused instead of a second window
     * opened when a person attempts to launch a second instance.
     *
     * Returns true if the current version of the app should quit instead of launching.
     * @return {bool}
     */
    makeSingleInstance() {
        if (process.mas) return false;

        return electron.app.makeSingleInstance(()=> {
            if (this.mainWindow) {
                if (this.mainWindow.isMinimized()) this.mainWindow.restore();
                this.mainWindow.focus();
            }
        })
    }

    /**
     *
     * @param mainWindow
     */
    set mainWindow(mainWindow) {
        this._mainWindow = mainWindow;
    }

    /**
     *
     * @return {*}
     */
    get mainWindow() {
        return this._mainWindow;
    }
}

module.exports = Application;