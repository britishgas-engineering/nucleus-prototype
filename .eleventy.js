const pluginNavigation = require("@11ty/eleventy-navigation");

module.exports = function (eleventyConfig) {

  eleventyConfig.addPlugin(pluginNavigation);

  eleventyConfig.setBrowserSyncConfig({
    // https://www.browsersync.io/docs/options
    codeSync: false
  });

  // copy `src/assets` to `dist/assets`
  eleventyConfig.addPassthroughCopy("src/assets");

  // copy style.css
  eleventyConfig.addPassthroughCopy("src/**/style.css");

  // copy script.js
  eleventyConfig.addPassthroughCopy("src/**/script.js");

  // copy _redirects
  eleventyConfig.addPassthroughCopy('src/_redirects');

  // copy manifest.webmanifest
  eleventyConfig.addPassthroughCopy("src/manifest.webmanifest");

  // setting the TemplateFormats to include the following this helps to pass through the project level `style.css` and `script.js` files
  eleventyConfig.setTemplateFormats([
    "njk",
    "html",
    "script.js",
    "style.css"
  ]);

  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
      layouts: "_layouts"
    }
  };

};
