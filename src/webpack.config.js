module.exports = {
  // ... other configurations
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: "pre",
        use: ["source-map-loader"],
        exclude: /node_modules/,
      },
    ],
  },
};
module.exports = {
  // Other configurations...
  devtool: false,
};
