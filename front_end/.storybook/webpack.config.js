const webpack = require('webpack');

module.exports = (baseConfig, env, defaultConfig) => {
  defaultConfig.plugins.push(
    new webpack.DefinePlugin({
      'analyticsID': "'test-123'",
      'analyticsDebug': true
    }),
  );
  // defaultConfig.loaders.push({
  //   test: /\.css$/,
  //   loader: 'style-loader!css-loader'
  // });
  return defaultConfig;
};