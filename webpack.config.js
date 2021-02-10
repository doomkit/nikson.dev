const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const prod = process.env.NODE_ENV === 'production';
const dev = !prod;
const filename = (ext) => (prod ? `[name].${ext}` : `[name].[contenthash].${ext}`);
const chunkFilename = (ext) => (prod ? `[id].${ext}` : `[id].[contenthash].${ext}`);

const plugins = () => {
    const plugins = [
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, 'src/index.html'),
            filename: 'index.html',
            minify: { collapseWhitespace: prod },
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: `./${filename('css')}`,
            chunkFilename: `./${chunkFilename('css')}`,
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/assets'),
                    to: path.resolve(__dirname, 'dist'),
                },
            ],
        }),
    ];
    if (prod) {
        /** Plugins for production */
        // TODO: optimize images
    }
    if (dev) {
        /** Plugins for development */
        new webpack.SourceMapDevToolPlugin({});
    }

    return plugins;
};

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: './nikson.js',
    output: {
        filename: `./${filename('js')}`,
        path: path.resolve(__dirname, 'dist'),
        publicPath: '',
    },
    devServer: {
        historyApiFallback: true,
        contentBase: path.resolve(__dirname, 'dist'),
        open: true,
        compress: true,
        hot: true,
        port: 3000,
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
        minimize: prod,
        minimizer: [
            new CssMinimizerPlugin({
                sourceMap: dev,
            }),
        ],
    },
    plugins: plugins(),
    devtool: prod ? false : 'source-map',
    module: {
        rules: [
            {
                test: /\.html$/,
                loader: 'html-loader',
            },
            {
                test: /\.css$/,
                use: [
                    prod
                        ? {
                              loader: MiniCssExtractPlugin.loader,
                              options: {
                                  publicPath: (resourcePath, context) => {
                                      return (
                                          path.relative(path.dirname(resourcePath), context) + '/'
                                      );
                                  },
                              },
                          }
                        : 'style-loader',
                    'css-loader',
                    'postcss-loader',
                ],
            },
            {
                test: /\.(sa|sc)ss$/,
                use: [
                    prod ? MiniCssExtractPlugin.loader : 'style-loader',
                    'css-loader',
                    'postcss-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            {
                test: /\.(?:|gif|png|jpg|jpeg|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: `./${filename('[ext]')}`,
                        },
                    },
                ],
            },
            {
                test: /\.(?:|woff2)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: `./${filename('[ext]')}`,
                        },
                    },
                ],
            },
        ],
    },
};
