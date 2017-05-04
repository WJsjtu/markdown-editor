const path = require("path");
const webpack = require("webpack");
const WebpackTask = require("./utils/webpack");

const constants = require("./../constants");

const development = true;

const getDefaultOptions = () => {
    return {
        externals: {
            'jquery': 'jQuery',
            'react': 'React',
            'react-dom': 'ReactDOM',
            'require': 'monacoRequire'
        },
        entry: path.join(constants.SOURCE_PATH, "browser", "index.js"),
        output: {
            path: constants.CLIENT_PATH,
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
    };
};

const markdownOptions = getDefaultOptions();
markdownOptions.entry = path.join(constants.SOURCE_PATH, "client", "markdown.js");
markdownOptions.output.filename = "markdown.js";
markdownOptions.output.library = "markdown";


const highlightTask = new WebpackTask("markdown", markdownOptions);

highlightTask.promise.catch(console.log.bind(console));