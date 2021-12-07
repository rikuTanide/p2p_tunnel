const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: "development",
    entry: "./subscriber/web/index.ts",
    output: {
        path: path.resolve(__dirname, './bin/subscriber/web/dist'),
        // filename: "[name]-[hash].bundle.js",
        filename: "[name].bundle.js",
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
            }
        ]
    },
    plugins: [
        // new CleanWebpackPlugin(),
        new HtmlWebpackPlugin(),
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    }
};