# Nucleus prototype

A Nucleus prototype environment using the Eleventy static site generator.

## Installation

Clone or download the GitHub repository: https://github.com/britishgas-engineering/nucleus-prototype

Open the `/nucleus-prototype` folder using terminal.

Assuming Node.js https://nodejs.org/ is installed.

### Install the npm packages

```bash
$  npm i
```

### Starting the environment

Launch Eleventy with this terminal command.

```bash
$  npx @11ty/eleventy --serve
```

### View in your browser

Open your browser at http://localhost:8080 and take a look at **Project one**

## Adding a project of your own

In the `/src` folder you'll find a folder called `/project`.

Duplicate this folder and give it a name `/my-demo`

Open the `/my-demo` folder and rename `project.json` to be the same name as your folder `my-demo.json`.

Edit `my-demo.json` to be something like:
```json
{
  "layout": "nucleus.njk",
  "tags": "my-demo",
  "teamname": "Project Team Name"
}
```

Edit the Front matter within `index.njk` to be something like:

```json
---
title: My Demo
eleventyNavigation:
  key: My Demo
  title: This is My Demo
  excerpt: This is my first prototype and is the start of something beautiful
---
```

Refresh your browser at http://localhost:8080 and you should now see a new card titled **This is My Demo** and a link to My Demo.

Repeat the process to create other prototypes.

🤩
