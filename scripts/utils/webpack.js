const path = require('path');
const webpack = require('webpack');
const clc = require('cli-color');

const APP_PATH = path.resolve(__dirname, "..", "..");

class WebpackTask {
    constructor(taskName, config) {

        this.taskName = taskName;

        if (Array.isArray(config.entry)) {
            this.fileList = config.entry.map((file) => {
                return file.replace(APP_PATH, "");
            }).join("\n");
        } else if (Object.prototype.toString.call(config.entry) === "[object String]") {
            this.fileList = config.entry.replace(APP_PATH, "");
        } else {
            this.fileList = taskName + " files";
        }

        this.promise = new Promise((resolve, reject) => {

            this.benchmark_start = new Date();

            console.log(
                "[" + clc.blackBright(WebpackTask.getTimeString(this.benchmark_start)) + "] " +
                "Starting \"" + clc.cyan(taskName) + "\"..."
            );

            webpack(config, (err, stats) => {

                this.benchmark_end = new Date();

                if (err) {
                    this.error(err.toString());
                    reject();
                } else if (stats.compilation.errors.length) {
                    this.error(stats.compilation.errors.map((e) => {
                        return e.message;
                    }).join("\n"));
                    reject();
                } else {
                    this.success();
                    resolve();
                }
            });
        });
    }

    /**
     * Get current time string.
     * @param {Date} current Current Date object.
     * @return {string}
     */
    static getTimeString(current) {
        return ['hour', 'minute', 'second'].map((name) => {
            const capitalFirstLetter = name.replace(/\b(\w)(\w*)/g, function ($0, $1, $2) {
                return $1.toUpperCase() + $2;
            });
            return +current['get' + capitalFirstLetter + 's']();
        }).map((value) => (value < 10 ? '0' : '') + value).join(':');
    }

    error(message) {
        console.error(
            "[" + clc.blackBright(WebpackTask.getTimeString(this.benchmark_end)) + "] " +
            clc.red("Error ") +
            clc.cyan(this.taskName) +
            "\" after " +
            clc.magenta("" + (this.benchmark_end - this.benchmark_start) + " ms ") + "\n" +
            clc.blue(this.fileList) + "\n" +
            clc.red(message)
        );
    }

    success() {
        console.log(
            '[' + clc.blackBright(WebpackTask.getTimeString(this.benchmark_end)) + "] " +
            clc.green("Finished ") + " \"" +
            clc.cyan(this.taskName) +
            "\" after " +
            clc.magenta("" + (this.benchmark_end - this.benchmark_start) + " ms ") + "\n" +
            clc.blue(this.fileList)
        );
    }
}

module.exports = WebpackTask;

