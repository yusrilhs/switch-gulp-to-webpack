const path = require('path');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const HTMLPlugin = require('html-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = (env) => {
  const isProduction = env === 'production';

  return {
    entry: ['./src/scripts/App.js', './src/styles/main.scss'],
    output: {
      path: path.join(__dirname, 'public'),
      filename: 'assets/scripts/bundle.js'
    },
    module: {
      rules: [
        {
          test: /\.html$/,
          use: [
            {
              loader: 'html-loader',
              options: {
                removeAttributeQuotes: isProduction,
                collapseWhitespace: isProduction,
                html5: isProduction,
                minifyCSS: isProduction,
                removeComments: isProduction,
                removeEmptyAttributes: isProduction,
                removeRedundantAttributes: isProduction,
                useShortDoctype: isProduction,
                removeStyleLinkTypeAttributes: isProduction,
                keepClosingSlash: isProduction,
                minifyJS: isProduction,
                minifyURLs: isProduction,
                attrs: [':data-src', ':src', ':xlink:href']
              }
            }
          ]
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
        {
          test: /\.(png|jpe?g|gif)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                outputPath: 'assets/images/',
                name: '[name].[ext]'
              }
            },
            {
              loader: 'img-loader',
              options: {
                enabled: isProduction
              }
            }
          ]
        },
        {
          test: /\.svg$/,
          loader: 'svg-sprite-loader',
          options: {
            extract: true,
            spriteFilename: 'images/sprite.svg'
          }
        },
        {
          test: /\.s|css$/,
          exclude: [/node_modules/, /\.svg$/],
          use: ExtractTextPlugin.extract({
            publicPath: '../../',
            use: [
              {
                loader: 'css-loader',
                options: {
                  sourceMap: true,
                  modules: true,
                  localIdentName: '[local]'
                }
              },
              {
                loader: 'postcss-loader',
                options: {
                  sourceMap: true
                }
              },
              {
                loader: 'sass-loader',
                options: {
                  sourceMap: true
                }
              }
            ]
          })
        }
      ]
    },

    // Plugins
    plugins: [
      new HTMLPlugin({
        filename: 'index.html',
        template: './src/index.html'
      }),
      new HTMLPlugin({
        filename: 'about.html',
        template: './src/about.html'
      }),
      new SpriteLoaderPlugin({
        plainSprite: true
      }),
      new ExtractTextPlugin('assets/styles/styles.css'),
      new BrowserSyncPlugin({
        host: 'localhost',
        port: 3000,
        proxy: 'http://localhost:8080/',
        notify: false,
        open: false
      },
        {
          reload: false
        })
    ],

    // Resolve extensions and modules paths
    resolve: {
      modules: ['./src', './node_modules']
    },

    // Source maps
    devtool: isProduction ? 'source-map' : 'inline-source-map',

    // Webpack Dev Server configuration
    devServer: {
      contentBase: path.join(__dirname, 'public'),
      historyApiFallback: true,
      stats: {
        all: false,
        warnings: true,
        errors: true,
        errorDetails: true
      }
    }
  }
}
