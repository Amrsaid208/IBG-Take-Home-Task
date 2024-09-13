const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  mode: 'production', // Set mode to production for minification
  entry: {
    index: './index.js',
  },
  performance: {
    hints: false, // Disables the performance hints
  }
  ,
  devtool: 'source-map', // Changed to 'source-map' for better debugging in production
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Production',
      template: 'app/index.html',
      filename: 'index.html',
    }),
    new ESLintPlugin({
      failOnError: true,
      emitWarning: false,
      outputReport: true,
    }),
    new VueLoaderPlugin(),
    // new BundleAnalyzerPlugin({
    //   // analyzerMode: 'static', // Generates a report.html file
    //   // openAnalyzer: true, // Automatically opens the report after build
    //   // reportFilename: 'bundle-report.html', // Customize report file name
    // }),
  ],
  devServer: {
    static: './dist',
    hot: true,
    historyApiFallback: true,
  },
  output: {
    filename: '[name].[contenthash].js', // Use contenthash for better caching
    path: path.resolve(__dirname, 'dist'),
    clean: true, // Clean the dist folder before each build
  },
  optimization: {
    minimize: false, // Enable file minimization
     usedExports: true, // Enable tree shaking
    sideEffects: true, 
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: true,
          mangle: true, // Reduce variable names to smaller ones
          output: {
            comments: false, // Remove comments from output
          },
        },
        extractComments: false, // Prevent extraction of comments to a separate file
      }),
    ],
    splitChunks: {
      chunks: 'all', // Apply splitting to both async and sync chunks
      maxInitialRequests: 10, // Maximum number of parallel requests when an entry point is loaded
      maxAsyncRequests: 20, // Maximum number of parallel requests when on-demand loading
      minSize: 20000, // Minimum size for splitting a chunk
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
          name: 'vendors',
        },
        default: {
          minChunks: 2, // Split only if used in at least 2 different chunks
          priority: -20,
          reuseExistingChunk: true,
          name: 'common',
        },
      },
    },
    runtimeChunk: 'single', // Split the runtime code into a separate chunk
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.(html)$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: true,
              esModule: false,
            },
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: 'angularjs-template-loader',
            options: {
              relativeTo: path.resolve(__dirname, './app'),
            },
          },
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        ],
      },
      {
        test: /\.(scss|css)/,
        exclude: [/vue-components|pages/],
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'styles/[name].[contenthash].css',
            },
          },
          {
            loader: 'extract-loader',
            options: {
              publicPath: '../',
            },
          },
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|svg|jpg|ico|gif)$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/[name].[contenthash].[ext]',
              outputPath: 'images',
              esModule: false,
            },
          },
        ],
      },
      {
        test: /\.(scss|css)$/,
        include: [/vue-components|pages/],
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
};
