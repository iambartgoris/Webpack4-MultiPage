const webpackMerge = require('webpack-merge');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpackConfigBase = require('./webpack.config.base.js');


// Prod config
const configProd = webpackMerge(webpackConfigBase, {
  optimization: {
    minimizer: [],
  },
  plugins: [],
});


// Optimize css
configProd.optimization.minimizer.push(new OptimizeCSSAssetsPlugin());


// Uglify js
const uglifyConf = {
  cache: true,
  uglifyOptions: {
    output: {
      comments: false,
    },
  },
};
configProd.optimization.minimizer.push(new UglifyJsPlugin(uglifyConf));


module.exports = configProd;
