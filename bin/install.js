const path = require("path");
const file = require("./utils/file");

const nodePath = path.resolve(__dirname, "..", "node_modules");
const libPath = path.resolve(__dirname, "..", "app", "lib");

file.removeDirectory(libPath);
file.makeDirectory(libPath);
file.copy(path.join(nodePath, "react", "dist", "react.min.js"), path.join(libPath, "react", "react.min.js"));
file.copy(path.join(nodePath, "react-dom", "dist", "react-dom.min.js"), path.join(libPath, "react", "react-dom.min.js"));
file.copy(path.join(nodePath, "bootstrap", "dist", "css"), path.join(libPath, "bootstrap", "css"));
file.copy(path.join(nodePath, "bootstrap", "dist", "fonts"), path.join(libPath, "bootstrap", "fonts"));
file.copy(path.join(nodePath, "monaco-editor", "min"), path.join(libPath, "monaco", "min"));
file.copy(path.join(nodePath, "monaco-editor", "min-maps"), path.join(libPath, "monaco", "min-maps"));
file.copy(path.join(nodePath, "highlight.js", "styles", "default.css"), path.join(libPath, "highlight", "default.css"));
file.copy(path.join(nodePath, "highlight.js", "styles", "monokai-sublime.css"), path.join(libPath, "highlight", "monokai-sublime.css"));
file.copy(path.join(nodePath, "katex", "dist", "katex.min.css"), path.join(libPath, "katex", "katex.min.css"));
file.copy(path.join(nodePath, "katex", "dist", "fonts"), path.join(libPath, "katex", "fonts"));