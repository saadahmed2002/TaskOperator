module.exports = {
    webpack(config) {
      config.module.rules.push({
        test: /\.html$/,
        use: ['raw-loader'], // or 'file-loader' if you want to include them as assets
      });
      return config;
    },
  };
  