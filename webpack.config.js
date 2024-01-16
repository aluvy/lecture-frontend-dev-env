const path = require("path");
const webpack = require("webpack");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const mode = process.env.NODE_ENV || "development";
const isDev = mode.includes("dev");
const isPro = mode.includes("pro");

module.exports = {
  mode,
  entry: {
    main: "./src/app.js"
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "[name].js",
    assetModuleFilename: '[path][hash][ext][query]'
  },
  devServer: {
    client: {
      overlay: true,
      progress: true,
      reconnect: false,
      logging: 'error',
    },
    static: {
      directory: path.join(__dirname, "dist"),
      publicPath: '/',
    },
    hot: true,
    proxy: {
      "/api": "http://localhost:8081",
    }
  },
  optimization: {
    minimize: isPro ? true : false,
    minimizer: isPro ? [
      new CssMinimizerPlugin(),
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ] : [],
    splitChunks: {
      chunks: "all"
    }
  },
  externals: {
    axios: "axios",
  },
  module: {
    rules: [
      {
        test: /\.(css|scss)$/i,
        exclude: /node_modules/,
        use: [
          isPro ? MiniCSSExtractPlugin.loader : "style-loader",
          {
            loader: "css-loader",
            options: {
              url: true,
            }
          },
          "sass-loader"
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/i,
        loader: "url-loader",
        dependency: { not: ['url'] },
        options: {
          name: "[path][name].[ext]?[hash]",
          limit: 1000, // 1kb
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        }
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: `Build Date: ${new Date().toLocaleString()}`,
      // entryOnly: true,
    }),
    new webpack.DefinePlugin({
      MODE: JSON.stringify(process.env.NODE_ENV),
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      templateParameters: {
        env: isPro ? "" : "(개발용)",
      },
      minify: isPro ? {
        collapseWhitespace: true,
        removeComments: true
      } : false,
    }),
    new CleanWebpackPlugin(),
    ...(isPro) ? [new MiniCSSExtractPlugin({
        linkType: false,
        filename: "[name].css",
        chunkFilename:"[name].chunk.css"
      })] : [],
    new CopyPlugin({
      patterns: [
        {
          from: "./node_modules/axios/dist/axios.min.js",
          to: "./axios.min.js"
        }
      ]
    })
  ]
}
