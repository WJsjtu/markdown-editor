const path = require("path");
const fse = require('fs-extra');

const joinPath = (base, subPath) => {
    const args = subPath.split("/");
    args.unshift(base);
    return path.resolve.apply(path, args);
};

const nodePath = joinPath(__dirname, "../node_modules");
const libPath = joinPath(__dirname, "../app/lib");


const copyList = [
    [joinPath(nodePath, "bootstrap/dist/css"), joinPath(libPath, "bootstrap/css")],
    [joinPath(nodePath, "bootstrap/dist/fonts"), joinPath(libPath, "bootstrap/fonts")],
    [joinPath(nodePath, "monaco-editor/min"), joinPath(libPath, "monaco/min")],
    [joinPath(nodePath, "monaco-editor/min-maps"), joinPath(libPath, "monaco/min-maps")],
    [joinPath(nodePath, "highlight.js/styles/default.css"), joinPath(libPath, "highlight/default.css")],
    [joinPath(nodePath, "highlight.js/styles/monokai-sublime.css"), joinPath(libPath, "highlight/monokai-sublime.css")],
    [joinPath(nodePath, "katex/dist/katex.min.css"), joinPath(libPath, "katex/katex.min.css")],
    [joinPath(nodePath, "katex/dist/fonts"), joinPath(libPath, "katex/fonts")],


    [joinPath(nodePath, "react/dist/react.min.js"), joinPath(libPath, "react/react.min.js")],
    [joinPath(nodePath, "react-dom/dist/react-dom.min.js"), joinPath(libPath, "react/react-dom.min.js")],
    [joinPath(nodePath, "redux/dist/redux.min.js"), joinPath(libPath, "redux/redux.min.js")],
    [joinPath(nodePath, "react-redux/dist/react-redux.min.js"), joinPath(libPath, "redux/react-redux.min.js")]
];


fse.emptyDirSync(libPath);
fse.outputFileSync(path.join(libPath, ".gitkeep"), "");
copyList.forEach((config) => {
    fse.copy(config[0], config[1]);
});