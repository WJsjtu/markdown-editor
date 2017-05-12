const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const {CheckerPlugin} = require('awesome-typescript-loader');

const constants = require('../../constants');

const development = process.env.NODE_ENV === 'development';

const options = {

    entry: path.join(constants.SOURCE_PATH, 'renderer/index.tsx'),
    output: {
        filename: 'app.js',
        path: path.join(constants.DIST_PATH, 'renderer'),
        libraryTarget: 'umd'
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    },

    devtool: development ? 'source-map' : false,

    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                exclude: [/node_modules/],
                use: [{
                    loader: 'awesome-typescript-loader'
                }]
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
                            localIdentName: '[local]_[hash:base64:8]',
                            minimize: !development,
                            sourceMap: development
                        }
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            minimize: !development
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new CheckerPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: development,
            mangle: !development,
            beautify: development,
            compress: development ? false : {
                warnings: false
            },
            output: {
                comments: development
            }
        })
    ],
    externals: {
        'react': {
            root: 'React',
            commonjs2: 'react',
            commonjs: 'react',
            amd: 'react',
        },
        'react-dom': {
            root: 'ReactDOM',
            commonjs2: 'react-dom',
            commonjs: 'react-dom',
            amd: 'react-dom',
        },
        'mobx-react': {
            root: 'mobxReact',
            commonjs2: 'mobx-react',
            commonjs: 'mobx-react',
            amd: 'mobx-react',
        },
        'mobx': {
            root: 'mobx',
            commonjs2: 'mobx',
            commonjs: 'mobx',
            amd: 'mobx',
        }
    },
    target: 'electron-renderer',
    stats: 'normal'
};

webpack(options).run((err, stats) => {
    if (err) {
        console.error(err);
        return;
    }

    console.log(stats.toString({
        chunks: false,  // Makes the build much quieter
        colors: true    // Shows colors in the console
    }));
});