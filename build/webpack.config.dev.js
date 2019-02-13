const webpackMerge = require('webpack-merge');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const path = require('path');
const portfinder = require('portfinder');
const webpackConfigBase = require('./webpack.config.base.js');


// Dev config
const configDev = webpackMerge(webpackConfigBase, {
  devServer: {
    contentBase: path.resolve(__dirname, '../dist'),
    port: 3000,
    watchOptions: {
      poll: 1000,
    },
    stats: {
      children: false,
    },
    publicPath: '/',
  },
  plugins: [],
});


// Stylelint
configDev.plugins.push(new StyleLintPlugin());


// Portfinder
module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = 3000;
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err);
    } else {
      configDev.devServer.port = port;
      resolve(configDev);
    }
  });
});
