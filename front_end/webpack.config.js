var path = require('path');
var webpack = require('webpack');
var node_modules_dir = path.resolve(__dirname, 'node_modules');


module.exports = {
  devtool: 'source-map',
  entry: ['./src/index'],
  output: {
    path: path.join(__dirname, '..', 'stock_loan', 'dist', 'js'),
    filename: 'bundle.js'
  },

  plugins:[
    new webpack.DefinePlugin({
      'analyticsID': "'UA-89959687-1'",
      'analyticsDebug': true
    })
  ],

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