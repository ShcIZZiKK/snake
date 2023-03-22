const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',

  devtool: 'inline-source-map',

  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },

  entry: {
    main: path.resolve(__dirname, './src/index.ts'),
  },

  output: {
    publicPath: '/',
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.js',
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: 'UTIP',
      template: './src/index.html',
      filename: 'index.html',
    }),
    new ESLintPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        { from: path.resolve(__dirname, 'src/assets/audio'), to: path.resolve(__dirname, 'dist/assets/audio') },
        { from: path.resolve(__dirname, 'src/assets/images'), to: path.resolve(__dirname, 'dist/assets/images') },
      ],
    }),
  ],

  module: {
    rules: [
      {
        test: /\.scss|css$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },

      {
        test: /\.(woff|woff2|ttf|otf|eot)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name][ext]',
        },
      },

      {
        test: /\.(jpe?g|png|gif)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name][ext]',
        },
      },

      {
        test: /\.js/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },

      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
};

// patterns: [
//   { from: path.resolve(__dirname, 'src/favicon.svg'), to: path.resolve(__dirname, 'dist') },
//   { from: path.resolve(__dirname, 'src/assets/icons'), to: path.resolve(__dirname, 'dist/assets/icons') },
//   { from: path.resolve(__dirname, 'src/assets/images'), to: path.resolve(__dirname, 'dist/assets/images') },
// ],
