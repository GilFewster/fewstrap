const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

// settings

const outputDir = "dist";
const entryFile = "./src/js/app.js";
const copyAssets = [{
  from: "src/images",
  to: "images",
}];
const template = {
  src: "./src/html/index.html",
  dest: "index.html",
};

// config and export

const config = {
  entry: entryFile,
  output: {
    path: path.resolve(__dirname, outputDir),
    filename: "app.js",
  },
  watch: true,
  module: {},
};

module.exports = (env, argv) => {
  const isDev = (argv.mode != "production");
  const rules = [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: "babel-loader",
      },
    },
    {
      test: /\.(sc|c)ss$/,
      use: [
        MiniCssExtractPlugin.loader,
        "css-loader",
        "sass-loader",
      ],
    },
    {
      test: /\.(png|jpg|gif)$/,
      use: [
        {
          loader: "file-loader",
          options: {
            name: "[name].[ext]",
          },
        },
      ],
    },
  ];

  const plugins = [
    new CleanWebpackPlugin(["dist"]),
    new MiniCssExtractPlugin({ filename: "[name].css" }),
    new HtmlWebpackPlugin({
      template: template.src,
      filename: template.dest,
    }),
    new BrowserSyncPlugin({
      host: "localhost",
      port: 3000,
      server: { baseDir: ["dist"] },
    }),
    new CopyWebpackPlugin(copyAssets),
  ];

  config.module.rules = rules;
  config.plugins = plugins;
  return config;
};
