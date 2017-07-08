import webpack from 'webpack';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import WebpackCleanupPlugin from 'webpack-cleanup-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';

const config = {
  entry: './client/src/app.js',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'public/dist'),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: path.join(__dirname, 'client/src'),
        exclude: ['node_modules'],
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['react', 'es2015', 'stage-2'],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        exclude: /(node_modules)/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, './client/src/index.html'),
    }),
    new WebpackCleanupPlugin(),
    new CleanWebpackPlugin(['dist', 'build'], {
      root: './',
      verbose: true,
      dry: false,
    }),
  ],
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    port: 1337,
    overlay: {
      warnings: true,
      errors: true,
    },
    hot: true,
    proxy: {
      '/api': 'http://localhost:9000',
    },
  },
};

export default config;
