var path = require('path');
var webpack = require('webpack');
var node_modules_dir = path.resolve(__dirname, 'node_modules');


module.exports = {
  devtool: 'source-map',
  entry: ['./src/index'],
  output: {
    path: path.join(__dirname, '..', 'stock_loan', 'static', 'js'),
    filename: 'bundle.js'
  },

  plugins:[
    new webpack.DefinePlugin({
      'analyticsID': "'UA-89959687-1'",
      'analyticsDebug': true,
      'appEnv': "'development'",
    })
  ],

  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        exclude: [node_modules_dir],
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.(gif|ttf|eot|svg|woff2?)$/,
        use: 'url-loader',
      },
    ]
  }
};