module.exports = {
  module: {
    rules: [
      {
        test: /\.html$/,
        use: {
            loader: 'html-loader'
        }
      },
      { test: /\.(?:ico|gif|png|jpg|jpeg)$/i, type: 'asset/resource' },
      { test: /\.(woff(2)?|eot|ttf|otf|svg|)$/, type: 'asset/inline' },
    ]
  }
}
