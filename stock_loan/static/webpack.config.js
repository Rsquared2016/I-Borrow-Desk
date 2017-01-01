var path = require('path');
var webpack = require('webpack');
var node_modules_dir = path.resolve(__dirname, 'node_modules');


module.exports = {
  devtool: 'cheap-eval-source-map',
  entry: ['./src/index'],
  output: {
    path: path.join(__dirname, 'dist', 'js'),
    filename: 'bundle.js'
  },

  module: {
    loaders: [{
      test: /\.css$/,
      loader: 'style-loader!css-loader'
    }, {
      test: /\.js$/,
      loaders: ['babel-loader'],
      exclude: [node_modules_dir],
      include: path.join(__dirname, 'src')
    }]
  }
};