const webpack = require('webpack')
const path = require('path')

module.exports = {
  entry: {
    vendor: ['lodash-es', '@babel/polyfill']
  },
  output: {
    path: path.resolve(__dirname, 'src/build'),
    filename: '[name].js',
    library: '[name]_library'
  },
  plugins: [
    new webpack.DllPlugin({
      path: './src/build/vendor.manifest.json',
      name: '[name]_library'
    })
  ]
}
