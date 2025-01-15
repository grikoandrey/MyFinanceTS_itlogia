const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
// const Dotenv = require('dotenv-webpack');

module.exports = {
    entry: './src/app.ts',
    mode: 'development',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader",
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        clean: true,
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        compress: true,
        port: 9013,
        historyApiFallback: true,
    },
    plugins: [
        // new Dotenv(),
        new HtmlWebpackPlugin({
            template: ('./index.html'),
            baseUrl: '/',
        }),
        new CopyPlugin({
            patterns: [
                {from: "./src/templates", to: "templates"},
                {from: "./src/static/images", to: "images"},
                {from: "./src/static/fonts", to: "fonts"},
                {from: "./src/styles/bootstrap.min.css", to: "css"},

                {from: "./src/js/bootstrap.bundle.min.js", to: "js"},
                {from: "./node_modules/chart.js/dist/chart.js", to: "js"},
                // {from: "./src/js/diagram.js", to: "js"},
            ],
        }),
    ],
};