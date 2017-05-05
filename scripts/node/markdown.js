const path = require("path");
const webpack = require("webpack");
const WebpackTask = require("./../utils/webpack");

const constants = require("./../../constants");

const highlightTask = new WebpackTask("markdown", {
    externals: {
        'jquery': 'jQuery',
        'react': 'React',
        'react-dom': 'ReactDOM',
        'require': 'monacoRequire'
    },
    entry: path.join(constants.SOURCE_PATH, "node", "markdown", "index.js"),
    output: {
        path: path.join(constants.DIST_PATH, "node"),
        filename: "markdown.js",
        library: "markdown",
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: constants.NODE_PATH,
                use: [
                    {
                        loader: "babel-loader"
                    }
                ]
            }, {
                test: /\.(less|css)$/,

                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader',
                        options: {
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
                loader: 'raw-loader'
            }
        ]
    },
    plugins: [
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
    target: "async-node"
});

highlightTask.promise.catch(console.log.bind(console));