const path = require('path');
module.exports = function override(config) {
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.alias,
      '@pages': path.resolve(__dirname, 'src/components/Pages'),
      '@contexts': path.resolve(__dirname, 'src/context'),
      '@interfaces': path.resolve(__dirname, 'src/@types'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@lib': path.resolve(__dirname, 'src/lib'),
    },
  };

  return config;
};
