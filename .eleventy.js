module.exports = function(config) {
  config.setBrowserSyncConfig({
    // https://www.browsersync.io/docs/options
    codeSync: false
  });
  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
      layouts: "_layouts"
    },
  }
};