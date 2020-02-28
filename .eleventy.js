const pluginNavigation = require("@11ty/eleventy-navigation");

module.exports = function(eleventyConfig) {

  eleventyConfig.addPlugin(pluginNavigation);

  eleventyConfig.setBrowserSyncConfig({
    // https://www.browsersync.io/docs/options
    codeSync: false
  });

  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
      layouts: "_layouts"
    }
  };

};
