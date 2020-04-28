const pluginNavigation = require("@11ty/eleventy-navigation");

module.exports = function(eleventyConfig) {

  eleventyConfig.addPlugin(pluginNavigation);

  // Find and copy any `jpg` files, maintaining directory structure.
  // eleventyConfig.addPassthroughCopy("*.js");
  //eleventyConfig.addPassthroughCopy({ "cli-build/help/*.js": "help" });
  
  // eleventyConfig.setTemplateFormats([
  //   "njk",
  //   "js"
  // ]);

  eleventyConfig.setBrowserSyncConfig({
    // https://www.browsersync.io/docs/options
    codeSync: false
  });

  eleventyConfig.addPassthroughCopy({ "cli-build/**/*.js" : ""});

  return {
    dir: {
      input: "cli-build",
      output: "dist",
      includes: "_includes",
      layouts: "_layouts"
    }
  };

};
