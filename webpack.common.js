const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './src/front/js/index.js', // Entry point for the application
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'), // Output directory
    publicPath: '/' // Adjust for deployment if needed
  },
  module: {
    rules: [
      // JavaScript and JSX files
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      // CSS and SCSS files
      {
        test: /\.(css|scss)$/,
        use: [
          'style-loader', // Injects styles into DOM
          'css-loader', // Resolves CSS imports
          'postcss-loader' // Processes CSS with PostCSS plugins
        ]
      },
      // Image files
      {
        test: /\.(png|jpg|jpeg|gif|webp)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]', // Keeps original file name and extension
            outputPath: 'assets/images' // Puts images in a subdirectory
          }
        }
      },
      // Font files
      {
        test: /\.(woff|woff2|ttf|eot)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'assets/fonts' // Puts fonts in a subdirectory
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'] // Simplified extensions
  },
  plugins: [
    new HtmlWebpackPlugin({
      favicon: '4geeks.ico', // Favicon for the application
      template: 'template.html' // Template HTML file
    }),
    new Dotenv({
      safe: true, // Ensures the presence of .env variables
      systemvars: true // Allows usage of system environment variables
    })
  ],
  devtool: 'source-map', // Useful for debugging in development
};
