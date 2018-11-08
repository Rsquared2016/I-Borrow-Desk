var path = require('path');
var webpack = require('webpack');
var node_modules_dir = path.resolve(__dirname, 'node_modules');

module.exports = {
  devtool: 'source-map',
  entry: ['./src/index'],
  output: {
    path: path.join(__dirname, '..', 'stock_loan', 'static', 'dist', 'js'),
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"',
      'analyticsID': "'UA-65249305-1'",
      'analyticsDebug': false,
      'appEnv': 'production',
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
      options: {
        // pass stuff to the loader
      }
    }),
    new webpack.optimize.OccurrenceOrderPlugin()

  ],
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.(gif|ttf|eot|svg|woff2?)$/,
        use: 'url-loader',
      },
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        exclude: [node_modules_dir],
        include: path.join(__dirname, 'src')
      },
    ]
  }
};