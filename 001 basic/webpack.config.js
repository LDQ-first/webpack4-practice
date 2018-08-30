// import path from 'path'
// import UglifyPlugin from 'uglifyjs-webpack-plugin'
const path = require('path')
const UglifyPlugin = require('uglifyjs-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')


module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        include: [
          path.resolve(__dirname, 'src')
        ],
        use: 'babel-loader'
      }
    ]
  },
  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, 'src')
    ],
    extensions: ['.wasm', '.mjs', '.js', '.json', '.jsx']
  },
  plugins: [
     // 使用 uglifyjs-webpack-plugin 来压缩 JS 代码
    new UglifyPlugin(),
    new HtmlWebpackPlugin() 
  ]
}