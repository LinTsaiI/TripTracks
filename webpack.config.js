// 載入相關模組
const webpack = require('webpack');
const path = require('path');
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'development',   // 預設為 production，使用 development 模式可以優化執行速度
  devtool: 'inline-source-map',
  entry: './src/index.js',   // entry point，告訴 webpack 從哪裡開始讀取檔案並建構該檔案所需的所有相依關係圖。預設為 ./src/index.js，也可以自訂或設定多個入口點
  output: {   // 設定打包完的檔案要輸出到哪個路徑及檔名為何。預設會放在 ./dist 中
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {   // 設定 Loaders 讓專案可以 import 任意型態的 module，例如 CSS file。test 屬性告訴 webpack 什麼檔案類型要 transform，use 屬性告訴 webpack 要用什麼 loader
    rules: [
      {
        test: /\.css$/,   // 偵測所有 css 結尾的檔案
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: 'file-loader',
      },
      {
        test: /\.m?js$/,   // 偵測所有 js 結尾的檔案
        exclude: /(node_modules|bower_components)/,   // 要排除的檔案
        use: 'babel-loader',
      }
    ],
  },
  plugins: [
    // new HtmlWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',   // 指定一個檔案作為 filename 的模板文件，即自動引入靜態檔案 (js, css...) 的目標文件。若沒有指定filename，則預設生成 index.html。若有指定 template，設定 title 無效。
      // favicon: '#'
    }),
    new MiniCssExtractPlugin(),   // 建立 mini-css-extract-plugin 實體
    new Dotenv()   // 使用 .env 中的變數
  ],
  devServer: {
    host: 'localhost',
    port: 3000,
    historyApiFallback: true,
    open: true,   // 啟動後自動打開頁面
    hot: true   // 啟用 Hot Module Replacement (HMR)，當對代碼進行修改並保存後，webpack 將對代碼重新打包，並將新的模塊發送到瀏覽器端，瀏覽器通過新的模塊替換老的模塊，這樣在不刷新瀏覽器的前提下就能夠對應用進行更新。
  }
};