const electron = require("electron");
if (process.env.NODE_ENV === "development") {
    window.__devtron = {require: require, process: process};
}