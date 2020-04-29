const path = require('path');
const fs = require('fs');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const publicUrlOrPath = process.env.PUBLIC_URL || '';

module.exports = {

  entry: './src/index',

  devtool: 'eval-source-map',

  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    publicPath: '/',
    compress: true,
    disableHostCheck: true,
    port: 8080,
    watchOptions: {
      ignored: /node_modules/,
      aggregateTimeout: 600
    },
    https: {
      key: fs.readFileSync('./key.pem'),
      cert: fs.readFileSync('./cert.pem')
    }
  },

  node: {
    fs: 'empty'
  },

  output: {
    path: `${__dirname}/dist`,
    filename: '[name].bundle.js',
    publicPath: publicUrlOrPath
  },

  plugins: [
    new Dotenv({
      safe: true
    }),
    new HtmlWebPackPlugin({
      template: './public/index.html',
      templateParameters: {
        PUBLIC_URL: publicUrlOrPath
      },
      favicon: './public/favicon.ico'
    })
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ]
      }
    ]
  },
  resolve: {
    alias: {
      'sodium-native': '@geut/sodium-javascript-plus',
      'sodium-universal': '@geut/sodium-javascript-plus'
    }
  }
};
