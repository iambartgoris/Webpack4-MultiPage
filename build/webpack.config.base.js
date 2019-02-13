const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebappWebpackPlugin = require('webapp-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const IconfontWebpackPlugin = require('iconfont-webpack-plugin');
const { getEntries } = require('./utils.js');

const entries = getEntries('./src/pug/views/', 'js');

// Base config
const config = {
  entry: Object.assign(entries, { app: ['./src/assets/js/scripts.js', './src/assets/scss/styles.scss'] }),
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'assets/js/[name].[hash:8].js',
    chunkFilename: 'assets/js/[name].[name].chunk.[chunkhash:8].js',
    publicPath: '/',
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, '../src'),
      assets: path.resolve(__dirname, '../src/assets'),
    },
  },
  module: {
    rules: [],
  },
  parallelism: 8,
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        commons: {
          name: 'commons',
          chunks: 'initial',
          minChunks: 2,
        },
        vendors: {
          chunks: 'initial',
          name: 'vendors',
          test: /node_modules\//,
          minChunks: 5,
          priority: 10,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
  plugins: [],
};


// Pug html loader
const pug = {
  test: /\.pug$/,
  use: [
    'html-loader',
    'pug-html-loader',
  ],
};
config.module.rules.push(pug);


// Convert ES6 into ES5 using Babel
const js = {
  test: /\.js$/,
  exclude: /node_modules/,
  use: ['babel-loader'],
};
config.module.rules.push(js);


// Image loader
const images = {
  test: /\.(gif|png|jpe?g)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
  use: [
    { loader: 'url-loader', options: { limit: 10000, name: 'assets/images/[name].[md5:hash:hex:8].[ext]', esModule: false } },
    {
      loader: 'image-webpack-loader',
      options: {
        disable: true,
        mozjpeg: {
          quality: 65,
        },
        pngquant: {
          quality: '65-90',
          speed: 4,
        },
        svgo: {
          plugins: [
            {
              removeViewBox: false,
            },
            {
              removeEmptyAttrs: false,
            },
          ],
        },
        gifsicle: {
          optimizationLevel: 7,
          interlaced: false,
        },
        optipng: {
          optimizationLevel: 7,
          interlaced: false,
        },
        webp: {
          quality: 75,
        },
      },
    },
  ],
};
config.module.rules.push(images);


// Font loader
const fonts = {
  test: /\.(woff|woff2|otf|ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
  use: [
    {
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: 'assets/fonts/[name].[md5:hash:hex:8].[ext]',
      },
    },
  ],
};
config.module.rules.push(fonts);


// Generate SVG sprites
const svgSprites = {
  test: /assets\/icons\/.*\.svg$/,
  use: [
    { loader: 'svg-sprite-loader' },
    'svg-fill-loader',
    'svgo-loader',
  ],
};
config.module.rules.push(svgSprites);


// SVG loader
const svg = {
  test: /assets\/images\/.*\.svg$/,
  use: {
    loader: 'svg-url-loader',
    options: {
      noquotes: true,
    },
  },
};
config.module.rules.push(svg);


// Convert scss into css
const scss = {
  test: /\.scss$/,
  use: [
    { loader: MiniCssExtractPlugin.loader, options: { publicPath: '../../' } },
    { loader: 'css-loader', options: { importLoaders: 1 } },
    {
      loader: 'postcss-loader',
      options: {
        plugins: loader => [
          new IconfontWebpackPlugin(loader),
        ],
      },
    },
    'sass-loader',
  ],
};
config.module.rules.push(scss);


// Simplify creation of HTML files
const pages = getEntries('./src/pug/views', 'pug');

Object.keys(pages).forEach((pathname) => {
  const conf = {
    baseTagUrl: '../',
    filename: `${pathname}.html`,
    template: path.resolve(__dirname, `.${pages[pathname]}`),
    inject: true,
    chunks: ['commons', 'vendors', 'app', pathname],
    chunksSortMode: 'manual',
  };
  config.plugins.push(new HtmlWebpackPlugin(conf));
});


// Generate favicons
const favConf = {
  logo: './src/assets/images/favicon.png',
  prefix: 'assets/images/favicons/',
  inject: true,
  icons: {
    android: true,
    appleIcon: true,
    appleStartup: true,
    coast: false,
    favicons: true,
    firefox: true,
    opengraph: false,
    twitter: false,
    yandex: false,
    windows: false,
  },
};
config.plugins.push(new WebappWebpackPlugin(favConf));


// MiniCSSExtract
const miniCSSExtractConf = {
  filename: 'assets/css/[name].[hash:8].css',
  chunkFilename: 'assets/css/[id].css',
};
config.plugins.push(new MiniCssExtractPlugin(miniCSSExtractConf));


// Clean dist directory
const cleanConf = { root: path.resolve(__dirname, '../') };
config.plugins.push(new CleanWebpackPlugin(['dist'], cleanConf));


module.exports = config;
