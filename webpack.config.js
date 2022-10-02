const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
  entry: {
    main: './js/main.js',
    admin: './adminApp/index.js',
  },
  output: {
    path: path.resolve(__dirname),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: ['vue-loader'],
      },
      {
        test: /\.s?css$/,
        use: [
          'vue-style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              additionalData: "@import 'scss/_varmixins';",
            },
          },
        ],
      },
    ],
  },
  plugins: [new VueLoaderPlugin()],
};
