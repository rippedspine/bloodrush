// var WebpackDevServer = require('webpack-dev-server')
var path = require('path')
var webpack = require('webpack')

module.exports = {
  devtool: 'source-map',
  debug: true,
  entry: {
    app: [
      'webpack-dev-server/client?http://localhost:3000',
      './src/index.js'
    ],
    vendor: [
      'three'
    ]
  },
  output: {
    path: path.join(__dirname, 'static'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: 'style!css?modules&importLoaders=1&localIdentName=[name]_[local]_[hash:base64:5]!postcss' },
      { test: /\.js$/, loader: 'babel' },
      { test: /\.glsl/, loader: 'shader' },
      { test: /\.(jpe?g|png)$/i, loader: 'file' }
    ],
    include: [
      path.resolve(__dirname, 'src')
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js')
    // new webpack.NoErrorsPlugin()
  ],
  resolve: {
    extensions: ['', '.js', '.css', '.glsl'],
    modulesDirectories: ['src', 'node_modules']
  },
  postcss: function () {
    return [require('precss'), require('autoprefixer')]
  },
  glsl: {
    chunkPath: 'chunks'
  }
}
