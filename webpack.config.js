const path = require("path");
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');

module.exports = (env) => {
  const isProduction = env === 'production';

  return {
    entry: ["./src/js/App.js", "./src/scss/main.scss"],
    output: {
      path: path.join(__dirname, 'public'),
      filename: 'scripts/bundle.js'
    },
    module: {
      rules: [{
        test: /\.html$/,
        use: [{
          loader: "html-loader",
          options: {
            minimize: isProduction,
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
            attrs: [':data-src', ':src', ":xlink:href"]
          }
        }]
      },
      {
        test: /\.(png|jpe?g|gif)/i,
        use: [{
          loader: "file-loader",
          options: {
            name: "images/[name].[ext]",
          }
        },
        {
          loader: "img-loader"
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
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          publicPath: '../',
          use: [{
            loader: "css-loader",
            options: {
              sourceMap: true,
              url: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
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
      },
      {
        loader: 'babel-loader',
        test: /\.js$/,
        exclude: /node_modules/
      }
      ]
    },
    plugins: [
      new HtmlWebPackPlugin({
        template: "./src/index.html",
        filename: "index.html"
      }),
      new HtmlWebPackPlugin({
        template: "./src/about.html",
        filename: "about.html"
      }),
      new ExtractTextPlugin({
        filename: "styles/style.css",
      }),
      new SpriteLoaderPlugin({
        plainSprite: true
      }),
      new BrowserSyncPlugin({
        host: 'localhost',
        port: 3000,
        proxy: 'http://localhost:8080/',
        notify: false,
        open: false
      }, {
          reload: false
        })
    ],
    devtool: isProduction ? 'source-map' : 'inline-source-map',
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
  };
}
