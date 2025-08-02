const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // Suppress specific warnings
      webpackConfig.ignoreWarnings = [
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
      if (webpackConfig.stats) {
        webpackConfig.stats.warnings = false;
      } else {
        webpackConfig.stats = {
          warnings: false,
        };
      }

      // Suppress noisy console warnings in development
      if (env === 'development') {
        webpackConfig.infrastructureLogging = {
          level: 'error',
        };
      }

      // Resolve ajv dependency issues
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        'ajv/dist/compile/codegen': path.resolve(__dirname, 'node_modules/ajv/dist/compile/codegen/index.js'),
      };

      // Add fallbacks for missing modules
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
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

      return webpackConfig;
    },
  },
};
