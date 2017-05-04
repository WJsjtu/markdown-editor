const hljs = require("highlight.js");
const katex = require("katex");

const markdown = require("markdown-it")({
    linkify: true,
    typographer: true,
    breaks: true,
    highlight: (str, lang) => {
        if (lang && hljs.getLanguage(lang)) {
            return hljs.highlight(lang, str).value;
        } else {
            return str.value;
        }
    }
});

markdown.use(require("markdown-it-math"), {
    inlineRenderer: function (str) {
        try {
            return "<span class=\"math inline\">" + katex.renderToString(str) + "</span>";
        } catch (e) {
            return "<span class=\"math inline\">" + e + "</span>";
        }
    },
    blockRenderer: function (str) {
        try {
            return "<span class=\"math block\">" + katex.renderToString(str) + "</span>";
        } catch (e) {
            return "<span class=\"math block\">" + e + "</span>";
        }
    }
}).use(require("markdown-it-toc"))
    .use(require("markdown-it-footnote"))
    .use(require("markdown-it-sub"))
    .use(require("markdown-it-sup"))
    .use(require("markdown-it-mark"))
    .use(require("markdown-it-deflist"))
    .use(require("markdown-it-ins"))
    .use(require("markdown-it-abbr"))
    .use(require("markdown-it-checkbox"));

markdown.renderer.rules.table_open = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    token.attrPush(["class", "table table-striped table-bordered"]);
    return self.renderToken(tokens, idx, options);
};

module.exports = (text) => {
    let result = false;
    try {
        result = markdown.render(text);
    } catch (e) {
        console.log("Markdown parse error: " + e.toString());
    }
    return result;
};
