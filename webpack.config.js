// 載入相關模組
const path = require('path');
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env, argv) => {
  return {
    mode: env.production ? 'production' : 'development',
    devtool: argv.mode === 'production' ? false : 'inline-source-map',
    entry: path.join(__dirname, 'src', 'index.js'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
      assetModuleFilename: 'img/[name][ext]',
      publicPath: '/'
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader']
        },
        {
          test: /\.(png|jpe?g|gif)$/i,
          type: 'asset',
        },
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: 'babel-loader',
        },
        {
          test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
          type: 'asset/resource',
          generator: {
            filename: 'font/[name][ext]'
          }
        }
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'src', 'index.html'),
      }),
      new MiniCssExtractPlugin(),
      new Dotenv({
        ignoreStub: true
      })
    ],
    devServer: {
      port: 3000,
      static: {
        directory: path.join(__dirname, 'dist'),
        watch: false,
      },
      open: true,
      hot: true,
      historyApiFallback: true,
    }
  }
};