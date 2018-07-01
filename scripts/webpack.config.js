const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { ImageminWebpackPlugin, imageminLoader } = require('imagemin-webpack');

const imageminGifsicle = require('imagemin-gifsicle');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminOptipng = require('imagemin-optipng');
const imageminPngquant = require('imagemin-pngquant');

const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());

const DEV = process.env.DEV === 'development';

function resolveApp(relativePath) {
  return path.resolve(appDirectory, relativePath);
}

const paths = {
  appSrc: resolveApp('src'),
  appBuild: resolveApp('build'),
  appIndexJs: resolveApp('src/app.js'),
  appNodeModules: resolveApp('node_modules')
};

const imageminManifest = {};
module.exports = {
  target: 'web',
  mode: DEV ? 'development' : 'production',
  devtool: DEV ? 'cheap-eval-source-map' : 'source-map',
  entry: {
    app: paths.appIndexJs
  },
  output: {
    filename: 'bundle.js',
    path: paths.appBuild
  },
  module: {
    rules: [
      { parser: { requireEnsure: false } },

      // js loader
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      // css loader
      {
        test: /\.(css|scss|sass)$/,
        use: [{
            loader: MiniCssExtractPlugin.loader
          },{
            loader: 'css-loader',
            options: {
              importLoader: 1
            }
          },
          {
            loader: 'sass-loader'
          }
        ]
      },

      // img loader
      {
        test: /\.(png|gif|jpe?g|svg)$/,
        use: [
          {
            loader: 'file-loader',
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new ImageminWebpackPlugin({
      cache: false,
      bail: true,
      loader: false,
      imageminOptions: {
        plugins: [
          imageminGifsicle({
            interlaced: true,
            optimizationLevel: 3
          }),
          // imageminOptipng({
          //   interlaced: true,
          //   optimizationLevel: 3
          // }),
          imageminPngquant({
            quality: 10,
            speed: 4,
          }),
          imageminJpegtran({
            progressive: true,
            optimizationLevel: 3
          }),
        ],
        name: "[name].[ext]",
        test: /\.(jpe?g|png|gif|svg)$/i,
        include: undefined,
        exclude: undefined
      }
    })
  ]
}