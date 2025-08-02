const path = require('path');

module.exports = function override(config, env) {
  // Suppress specific warnings
  config.ignoreWarnings = [
    // Ignore sourcemap-codec warnings
    /sourcemap-codec/,
    // Ignore workbox warnings
    /workbox/,
    // Ignore magic-string warnings
    /magic-string/,
    // Ignore other common warnings
    /Failed to parse source map/,
    /Critical dependency/,
    // Ignore webpack warnings about dynamic imports
    /the request of a dependency is an expression/,
  ];

  // Configure webpack to handle warnings better
  if (config.stats) {
    config.stats.warnings = false;
  } else {
    config.stats = {
      warnings: false,
    };
  }

  // Suppress noisy console warnings in development
  if (env === 'development') {
    config.infrastructureLogging = {
      level: 'error',
    };
  }

  // Resolve ajv dependency issues
  config.resolve.alias = {
    ...config.resolve.alias,
    'ajv/dist/compile/codegen': path.resolve(__dirname, 'node_modules/ajv/dist/compile/codegen/index.js'),
    'ajv': path.resolve(__dirname, 'node_modules/ajv'),
  };

  // Add resolve fallbacks for Node.js modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "ajv/dist/compile/codegen": require.resolve("ajv/dist/compile/codegen"),
    "crypto": false,
    "stream": false,
    "assert": false,
    "http": false,
    "https": false,
    "os": false,
    "url": false,
    "zlib": false,
  };

  // Optimize chunks to reduce warnings
  if (config.optimization) {
    config.optimization.splitChunks = {
      ...config.optimization.splitChunks,
      cacheGroups: {
        ...config.optimization.splitChunks.cacheGroups,
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    };
  }

  return config;
};
