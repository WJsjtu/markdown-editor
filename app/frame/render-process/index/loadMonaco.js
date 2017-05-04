/**
 *
 * @param baseUrl {string}
 * @param callback {function}
 */
module.exports = (baseUrl, callback = () => true) => {
    monacoRequire.config({
        baseUrl: baseUrl
    });

    // workaround monaco-css not understanding the environment
    self.module = undefined;
    // workaround monaco-typescript not understanding the environment
    self.process.browser = true;

    monacoRequire(["vs/editor/editor.main"], () => {
        callback();
    });
};