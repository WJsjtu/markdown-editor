const exec = require("child_process").exec;
const constants = require("./../constants");

exec("electron ./app/ --debug", {
    cwd: constants.ROOT_PATH
});