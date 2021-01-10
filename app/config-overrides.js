const path = require('path');
module.exports = function override(config) {
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.alias,
      '@atoms': path.resolve(__dirname, 'src/components/atoms'),
      '@molecules': path.resolve(__dirname, 'src/components/molecules'),
      '@organisms': path.resolve(__dirname, 'src/components/organisms'),
      '@pages': path.resolve(__dirname, 'src/components/pages'),
      '@contexts': path.resolve(__dirname, 'src/context'),
      '@interfaces': path.resolve(__dirname, 'src/@types'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@core': path.resolve(__dirname, 'src/lib/classes'),
      '@services': path.resolve(__dirname, 'src/lib/services'),
      '@scripts': path.resolve(__dirname, 'src/lib/scripts'),
    },
  };

  return config;
};
