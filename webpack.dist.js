const path = require('path');
const webpack = require('webpack');
const config = require('./webpack.base');

// plugins
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
const DedupePlugin = webpack.optimize.DedupePlugin;
const DefinePlugin = webpack.DefinePlugin;
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OccurenceOrderPlugin = webpack.optimize.OccurenceOrderPlugin;
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;


module.exports = {
  cache: true,
  debug: true,
  devtool: 'source-map',
  entry: config.entry,
  output: config.output,
  resolve: config.resolve,
  postcss: config.postcss,
  sassLoader: config.sassLoader,

  module: {
    loaders: [
      // expose jquery as $ or jQuery
      { test: /jquery\.js$/, loader: 'expose?$' },
      { test: /jquery\.js$/, loader: 'expose?jQuery' },

      {test: /\.html$/, loader: 'raw'},
      {test: /\.ts$/, exclude: [/\.spec\.ts$/, /node_modules/], loader: 'ts'},
      {test: /\.scss$/, include: [path.resolve(__dirname, 'src/components')], loader: 'raw!postcss-loader!sass'},
      {test: /\.scss$/, include: [path.resolve(__dirname, 'src/styles')], loader: ExtractTextPlugin.extract('css!postcss-loader!sass')},

      { test: /bootstrap\/js\//, loader: 'imports?jQuery=jquery' },

      // Needed for the css-loader when bootstrap-webpack loads bootstrap's css.
      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,   loader: "url?limit=10000&minetype=application/font-woff" },
      { test: /\.(woff|woff2)$/, loader: "url?limit=10000&minetype=application/font-woff" },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,    loader: "url?limit=10000&minetype=application/octet-stream" },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,    loader: "file" },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,    loader: "url?limit=10000&minetype=image/svg+xml" }
    ],

    noParse: config.module.noParse
  },

  plugins: [
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new ExtractTextPlugin('styles.css'),
    new DedupePlugin(),
    new OccurenceOrderPlugin(),
    new CommonsChunkPlugin({name: 'vendor', filename: 'vendor.js', minChunks: Infinity}),
    new HtmlWebpackPlugin({
      chunksSortMode: 'none',
      filename: 'index.html',
      hash: true,
      inject: 'body',
      template: './src/index.html'
    }),
    new UglifyJsPlugin({
      compress: {
        dead_code: true,
        screw_ie8: true,
        unused: true,
        warnings: false
      },
      mangle: false
    })
  ],

  stats: {
    cached: true,
    cachedAssets: true,
    chunks: true,
    chunkModules: true,
    colors: true,
    hash: false,
    reasons: false,
    timings: true,
    version: false
  }
};
