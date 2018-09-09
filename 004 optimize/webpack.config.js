// import path from 'path'
// import UglifyPlugin from 'uglifyjs-webpack-plugin'
const path = require('path')
const UglifyPlugin = require('uglifyjs-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const webpack = require('webpack')

console.log(`process.env.NODE_ENV: `, process.env.NODE_ENV) // undefined

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?/, // 支持 js 和 jsx
        include: [
          path.resolve(__dirname, 'src') // src 目录下的才需要经过 babel-loader 处理
        ],
        use: 'babel-loader'
      },
      /* {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true
              }
            },
            'postcss-loader',
            'less-loader'
          ]
        })
      }, */
      {
        test: /\.(sa|sc|le|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            /* options: {
              modules: true, 
              importLoaders: 2
            } */
          },
          'postcss-loader',
          'less-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {  // 压缩 jpeg 的配置
                progressive: true,
                quality: 65
              },
              optipng: {  // 使用 imagemin-optipng 压缩 png，enable: false 为关闭
                enabled: false,
              },
              pngquant: { // 使用 imagemin-pngquant 压缩 png
                quality: '65-90',
                speed: 4
              },
              gifsicle: { // 压缩 gif 的配置
                interlaced: false
              },
              webp: { // 开启 webp，会把 jpg 和 png 图片压缩为 webp 格式
                quality: 75
              }
            }
          }
        ]
      }
    ]
  },
  // 代码模块路径解析的配置
  resolve: {
    modules: [
      path.resolve(__dirname, "node_modules")  // 使用绝对路径指定 node_modules，不做过多查询
    ],
    // 删除不必要的后缀自动补全，少了文件后缀的自动匹配，即减少了文件路径查询的工作
    // 其他文件可以在编码时指定后缀，如 import('./index.scss')
    extensions: [
    // ".wasm", ".mjs", 
    ".js", 
    // ".json", ".jsx"
    ],
    // 避免新增默认文件，编码时使用详细的文件路径，代码会更容易解读，也有益于提高构建速度
    mainFiles: ['index'],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: "initial",
          test: path.resolve(__dirname, "node_modules"), // 路径在 node_modules 目录下的都作为公共部分
          name: "vendor", // 使用 vendor 入口作为公共部分
          enforce: true
        }
      }
    }
  },

  plugins: [
     // 使用 uglifyjs-webpack-plugin 来压缩 JS 代码
    // new UglifyPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
      minify: {
        minifyCSS: true,
        minifyJS: true,
        removeComments: true
      }
    }),
    // new ExtractTextPlugin('[name].css'),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].[hash].css',
      chunkFilename:'[id].[hash].css',
    }),
    new OptimizeCSSAssetsPlugin({}),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    hot: true
  }
}