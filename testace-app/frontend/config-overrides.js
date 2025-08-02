const path = require('path');

module.exports = function override(config, env) {
  // Resolve ajv dependency issues
  config.resolve.alias = {
    ...config.resolve.alias,
    'ajv/dist/compile/codegen': path.resolve(__dirname, 'node_modules/ajv/dist/compile/codegen/index.js'),
    'ajv': path.resolve(__dirname, 'node_modules/ajv'),
  };

  // Fallback for missing modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "ajv/dist/compile/codegen": require.resolve("ajv/dist/compile/codegen"),
  };

  return config;
};
