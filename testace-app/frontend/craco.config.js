const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // Resolve ajv dependency issues
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        'ajv/dist/compile/codegen': path.resolve(__dirname, 'node_modules/ajv/dist/compile/codegen/index.js'),
      };

      // Add fallbacks for missing modules
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        "ajv/dist/compile/codegen": require.resolve("ajv/dist/compile/codegen"),
      };

      return webpackConfig;
    },
  },
};
