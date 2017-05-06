const path = require("path");
const webpack = require("webpack");
const WebpackTask = require("./../utils/webpack");

const constants = require("./../../constants");

const development = false;

const highlightTask = new WebpackTask("browser", {

    entry: path.join(constants.SOURCE_PATH, "browser", "index.js"),
    output: {
        path: path.join(constants.DIST_PATH, "browser"),
        filename: "app.js",
        library: "app",
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [/node_modules/],
                use: [
                    {
                        loader: "babel-loader"
                    }
                ]
            }, {
                test: /\.(less|css)$/,
                exclude: [/node_modules/],
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            localIdentName: '[local]_[hash:base64:5]',
                            minimize: true
                        }
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            minimize: true
                        }
                    }
                ]
            }, {
                test: /\.(tmpl|txt)$/,
                exclude: [/node_modules/],
                loader: 'raw-loader'
            }
        ]
    },
    plugins: development ? [
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("development")
            }
        })
    ] : [
        //new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: false,
            compress: {
                dead_code: true,
                drop_debugger: true,
                unused: true,
                if_return: true,
                warnings: true,
                join_vars: true
            },
            output: {
                comments: false
            }
        })
    ],
    devtool: false,
    target: "electron-renderer"
});

highlightTask.promise.catch(console.log.bind(console));