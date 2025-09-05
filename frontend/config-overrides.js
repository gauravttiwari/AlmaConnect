const webpack = require('webpack');

module.exports = function override(config) {
  config.resolve = config.resolve || {};
  config.resolve.fallback = {
    ...config.resolve.fallback,
    stream: require.resolve('stream-browserify'),
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    url: require.resolve('url/'),
    assert: require.resolve('assert/'),
    util: require.resolve('util/'),
    zlib: require.resolve('browserify-zlib'),
    process: require.resolve('process/browser.js'),
    buffer: require.resolve('buffer/')
  };
  config.resolve.alias = {
    ...(config.resolve.alias || {}),
    'process/browser': require.resolve('process/browser.js')
  };
  config.plugins = [
    ...(config.plugins || []),
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ];
  return config;
};
