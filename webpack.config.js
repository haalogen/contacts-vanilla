var path = require('path');
var webpack = require("webpack");


module.exports = {
  entry: './src/contactsList.js', // путь к вашему главному js файлу

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build')
  },

  module: {
    rules: [{ /* Как обрабатывать каждый загружаемый файл */
      test: /\.js$/, // запустим загрузчик во всех файлах .js
      exclude: /node_modules/, // проигнорируем все файлы в папке node_modules
      use: {
        loader:'babel-loader',
        options: { presets: ['env'] },
      }
    }
    ] // rules
  },

  devtool: 'inline-source-map',

  plugins: [
    new webpack.optimize.UglifyJsPlugin()
  ]
};