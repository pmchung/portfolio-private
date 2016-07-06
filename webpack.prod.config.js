var path = require('path')
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var nodeExternals = require('webpack-node-externals');

var loaders = [
      { /* Babel */
        test: /\.js$/, 
        loader: 'babel', 
        exclude: [/node_modules/]
      },
      { /* Extract/Style/CSS/Sass load */
        test: /\.scss$/, 
        loader: ExtractTextPlugin.extract('style', 'css?localIdentName=[name]__[local]___[hash:base64:5]!sass'), 
        exclude: [/node_modules/]
      },
      { test: /\.png$/, loader: "file-loader" },
      { test: /\.jpg$/, loader: "file-loader" },
      { test: /\.woff$/, loader: "file-loader" },
      { test: /\.otf$/, loader: "file-loader" },
      { test: /\.svg/,  loader: 'svg-url-loader'}
    ];

/* Multiple config build */

module.exports = [
/*********** Bundle client *************/
{
  name: 'Client',
  devtool: 'source-map',
  entry: [
    './src/client.js'
  ],
  output: {
    path: path.join(__dirname, './build/dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({compress: { warnings: false }}),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.DefinePlugin({
      "process.env": {
        CanUseDom: JSON.stringify(true),
        NODE_ENV: JSON.stringify("production") 
      }
    }),
    new ExtractTextPlugin("styles.css"), 
  ],
  module: {
    loaders: loaders
  },
 resolve: {
   extensions: ['', '.js', '.es6', '.jsx', '.scss']
 },
},
/*********** Bundle server for universal *************/
{
  name: 'Server',
  devtool: 'source-map',
  entry: [
    './src/server.js'
  ],
  output: {
    path: path.join(__dirname, './build/dist/'),
    filename: '../server.js',
    libraryTarget: 'commonjs2',
    publicPath: '/static/'
  },
  /* dont bundle node_modules */
  externals: [nodeExternals()],
  target: 'node',
  /* dont use webpack's mock */
  node: {
    __dirname: false,
    __filename: false,
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({compress: { warnings: false }}),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.DefinePlugin({
      "process.env": {
        CanUseDom: JSON.stringify(false),
        NODE_ENV: JSON.stringify("production") 
      }
    }),
    new ExtractTextPlugin("styles.css"), 
  ],

  module: {
    loaders: loaders
  },
 resolve: {
   extensions: ['', '.js', '.es6', '.jsx', '.scss']
 },
}

];
