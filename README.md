<p align="center"><img src="https://user-images.githubusercontent.com/35331661/37280452-2062eaa8-25ee-11e8-9546-0bdfec1c472f.png" width="400px"></p>


# Switch Gulp to Webpack

Since the beginning of my front end development technologies education I have been using [**Gulp**](https://gulpjs.com) as main workflow toolkit. Gulp was responsible for:
* taking one (or more) HTML file and producing the minified version
* compiling SASS to CSS and producing the minified version
* adding vendor prefixes to CSS
* compiling Javascript with Babel and producing the minified version
* optimizing images
* creating server (via [Browsersync](https://browsersync.io)) to easily browse website on all devices
* watching files and re-compiling on save

But from the moment when I started to learn [React](https://reactjs.org) I had to learn using [**Webpack**](https://webpack.js.org). And I loved it!
I found out that with it's help I can also create all above tasks. So I made simple starter for creating website using that bundler.

## Directory structure

```bash
├── node_modules/                      # 3rd-party libraries and utilities
├── public/                            # Compiled output
├── src/                               # Website source code
│   ├── img/                           # Images and icons
│   ├── js/                            # JavaScript files
│   ├── scss/                          # Sass files using the 7-1 architecture pattern
│   ├── index.html                     # HTML template
│   ├── about.html                     # HTML template
├── .babelrc                           # Babel configuration
├── .browserslistrc                    # Browserslist configuration
├── postcss.config.js                  # Post CSS configuration
└── package.json                       # List of project dependencies + NPM scripts
└── webpack.config.js                  # Webpack configuration
```

## Configuration files

### .babelrc

```javascript
{
  "presets": [
    "env"
  ]
  // "plugins": []
}
```

[Babel](https://github.com/babel/babel) with 'env' preset compiles next generation JavaScript features down to a supported version (ES5).
You can also add many usefull plugins as [transform-object-rest-spread](https://babeljs.io/docs/plugins/transform-object-rest-spread/) or [transform-class-properties](https://babeljs.io/docs/plugins/transform-class-properties/).

### .browserslistrc

```
>1%
last 4 versions
ie 10
```

[Browserslist](https://github.com/ai/browserslist) targets browsers between different front-end tools like Babel or autoprefixer which our projest use. This configuration targets more that 1% versions selected by global usage statistics, the last 2 versions for each browser and Internet Explorer 10. You can find a lot more queries in [documentation](https://github.com/ai/browserslist#queries).

### postcss.config.js

```javascript
module.exports = {
  plugins: [
    require('autoprefixer'),
    require('postcss-flexbugs-fixes')
  ]
}
```

[PostCSS](http://postcss.org) is a tool for transforming CSS. In my project I use it only for [Autoprefixer](https://github.com/postcss/autoprefixer) which adds vendor prefixes to css rules and [Flexbugs Fixes](https://github.com/luisrudge/postcss-flexbugs-fixes) which fix flexbug's issues.

### webpack.config.js

```javascript
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
```
