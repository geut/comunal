'use strict'

const path = require('path')
const { spawn } = require('child_process')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { HotModuleReplacementPlugin } = require('webpack')
const nodeExternals = require('webpack-node-externals')

module.exports = (_, { mode }) => {
  const port = 1212
  const publicPath =
    mode === 'production' ? './' : `http://localhost:${port}/assets`

  return {
    watch: true,
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
          test: /\.svg$/,
          exclude: /node_modules/,
          use: {
            loader: '@svgr/webpack',
            options: {}
          }
        },
        {
          test: /\.ttf$/,
          exclude: /node_modules/,
          use: {
            loader: 'file-loader'
          }
        },
        {
          test: /\.css$/,
          include: path.resolve(__dirname, 'app'),
          exclude: /node_modules/,
          use: [
            'style-loader',
            { loader: 'css-loader', options: { importLoaders: 1 } },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: [require('tailwindcss'), require('autoprefixer')]
              }
            }
          ]
        }
      ]
    },

    output: {
      path: `${__dirname}/build`,
      publicPath,
      filename: 'bundle.js'
    },

    plugins: [
      new HotModuleReplacementPlugin(),
      new HtmlWebpackPlugin({
        inject: true,
        template: `${__dirname}/static/index.html`
      })
    ],

    externals: [
      nodeExternals({
        whitelist: [/^@babel/]
      })
    ],

    target: 'electron-renderer',

    entry: `${__dirname}/app/index.js`,

    node: {
      __dirname: false,
      __filename: false
    },

    devServer: {
      port,
      publicPath: '/assets/',
      noInfo: true,
      contentBase: `${__dirname}/static`,
      watchOptions: {
        aggregateTimeout: 300,
        ignored: /node_modules/,
        poll: 100
      },
      clientLogLevel: 'debug',
      before () {
        console.log('Starting Main Process...')
        spawn('npm', ['run', 'start:main'], {
          shell: true,
          env: process.env,
          stdio: 'inherit'
        })
          .on('close', code => process.exit(code))
          .on('error', err => console.error(err))
      }
    }
  }
}
