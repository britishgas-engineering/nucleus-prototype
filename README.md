# nucleus-prototype

A Nucleus prototype environment using eleventy and less compiler.

Learnings from:

https://www.11ty.io/docs/getting-started/

https://www.npmjs.com/package/less-watch-compiler

## Installation

Clone or download the GitHub repository: https://github.com/andij/nucleus-prototype

Open the /nucleus-prototype folder using a favourite terminal. Mine is [iTerm2](https://iterm2.com/).

Assuming Node.js https://nodejs.org/ is installed.

### Install the npm packages

```bash
🔹  npm i
```

## Starting the environment

Continue running a few more commands in terminal.

### Run the less-watch-compiler to compile the styles

This will produce the `main.css` in the `/dist` folder.

```bash
🔹  npx less-watch-compiler
```

#### Optional

Anytime the styles for the nucleus-prototype are changed, run this command.

If lots of styling is being worked on, change `runOnce` flag in `less-watch-compiler.config.json`

* From

```json
"runOnce": true
```

* To

```json
"runOnce": false
```

This will continue to watch the `_styles` folder for any changes and recompile `main.css`.

### Launch Eleventy
```bash
🔹  npx @11ty/eleventy --serve
```
Open your browser at http://localhost:8080 and relish in the vanilla prototype environment you have started.

## Connecting Nucleus

This step is where we pick up the CDN of the Nucleus library and include it into our template.

The `_layouts/live.njk` includes the Nucleus javascript library at `https://nucleus.bgdigital.xyz/nucleus.min.js`.

Changing the layout file in the frontmatter of index.md

* From

```json
layout: basic.njk
```
* To

```json
layout: live.njk
```
Refreshing the browser will show the Nucleus font.



