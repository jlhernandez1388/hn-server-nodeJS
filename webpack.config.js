const path = require('path');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const HashPlugin = require('hash-webpack-plugin');

let jsFilename = 'js/main-dev.js';
let cssFilename = './css/main-dev.css';

if (process.env.NODE_ENV === 'production') {
  jsFilename = 'js/main-[hash].js';
  cssFilename = './css/main-[hash].css';
}

module.exports = {
  devtool: 'source-map',
  entry: './app/public/bundle.js',
  output: {
    path: path.join(__dirname, 'build', 'public'),
    filename: jsFilename
  },
  module: {
    rules: [{
      // JavaScript
      test: /\.js$/,
      use: [
        { loader: 'babel-loader', query: { presets: [['es2015']] } },
        'eslint-loader'
      ]
    }, {
      // CSS Vendor files
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: 'css-loader'
      })
    }, {
      // Stylus files
      test: /.styl$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'stylus-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => {
                return [autoprefixer({ browsers: ['last 2 versions'] })];
              }
            }
          }
        ]
      })
    }, {
      test: /\.(jpe?g|png|gif|svg)$/i,
      use: [
        'file-loader?name=./img/[name].[ext]',
        {
          loader: 'image-webpack-loader',
          query: {
            bypassOnDebug: true,
            progressive: true,
            optipng: { optimizationLevel: 7 },
            gifsicle: { interlaced: false }
          }
        }
      ]
    }]
  },
  plugins: [
    new ExtractTextPlugin(cssFilename),
    new LiveReloadPlugin(),
    new HashPlugin({
      path: path.join(__dirname, 'build'),
      fileName: 'HASH'
    })
  ]
};
