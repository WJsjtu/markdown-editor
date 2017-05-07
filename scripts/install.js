const exec = require('child_process').exec;
const constants = require('./../constants');

exec('npm install', {
    cwd: constants.APP_PATH
});