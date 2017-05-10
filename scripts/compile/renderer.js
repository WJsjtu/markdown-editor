const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const constants = require('../../constants');

const development = process.env.NODE_ENV === 'development';

const defaultOptions = {
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
        'redux': {
            root: 'Redux',
            commonjs2: 'redux',
            commonjs: 'redux',
            amd: 'redux',
        },
        'react-redux': {
            root: 'ReactRedux',
            commonjs2: 'react-redux',
            commonjs: 'react-redux',
            amd: 'react-redux',
        },
        'prop-types': {
            root: 'PropTypes',
            commonjs2: 'prop-types',
            commonjs: 'prop-types',
            amd: 'prop-types'
        }
    },
    output: {
        path: path.join(constants.DIST_PATH, 'renderer'),
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [/node_modules/],
                use: [
                    {
                        loader: 'babel-loader'
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
                            localIdentName: '[name]_[local]_[hash:base64:5]',
                            minimize: !development
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
    devtool: development ? 'source-map' : false,
    target: 'electron-main',
    stats: 'normal'
};

const configs = [];

const renderPath = path.join(constants.SOURCE_PATH, 'renderer');

(fs.readdirSync(renderPath) || []).forEach((subPath) => {

    const currentPath = path.join(renderPath, subPath);
    const stats = fs.statSync(currentPath);

    const options = Object.assign({}, defaultOptions);

    if (stats.isFile() && subPath.match(/\.js(x)?$/ig)) {
        options.entry = currentPath;
        options.output.filename = path.basename(currentPath);
        configs.push(options);
    } else if (stats.isDirectory()) {
        const indexPath = path.join(currentPath, 'index.js');
        if (fs.existsSync(indexPath)) {
            options.entry = indexPath;
            options.output.filename = path.basename(subPath + '.js');
            configs.push(options);
        }
    }
});

webpack(configs).run((err, stats) => {
    if (err) {
        console.error(err);
        return;
    }

    console.log(stats.toString({
        chunks: false,  // Makes the build much quieter
        colors: true    // Shows colors in the console
    }));
});