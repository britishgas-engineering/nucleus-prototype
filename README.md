# Nucleus prototype

A Nucleus prototype environment using the eleventy static site generator published at: https://nucleus-prototype.drew-jones.com

[![Netlify Status](https://api.netlify.com/api/v1/badges/90b95afb-1b42-47c5-8e81-4f4e03816e6d/deploy-status)](https://app.netlify.com/sites/keen-franklin-5ffbd4/deploys)

## Installation

Clone or download the GitHub repository: https://github.com/andij/nucleus-prototype

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

Open your browser at http://localhost:8080 to view the Nucleus prototype environment.

### Displaying a Nucleus page

In the `/src` folder we create a folder. Any name will do, let's use `/demo`.

create a file `index.njk` and include a `title` in the front matter.

```json
---
title: Page title
---
```

We can then include any Nucleus components. Let's start with the Landmark:

```html
<ns-landmark type="hillside">
  <h1 slot="heading">
    <span class="h5">Hub umami locavore.</span>
    <span class="h1 enlighten">Typewriter pin <b>chambray mixtape</b></span>
  </h1>
  <div slot="paragraph">
    <p>Cred sartorial shaman pitchfork mumblecore braid cronut shaman gastropub taiyaki godard roof party. <a href="#caveat" aria-label="Additional information 1">1</a></p>
  </div>
</ns-landmark>
```

Then add some more stuff.

```html
<ns-panel>
  <div class="splish">
    <h2>Bushwick kitsch truffaut bespoke stumptown</h2>
    <p class="p-feature">Coloring book palo santo drinking vinegar twee heirloom iceland la croix listicle.</p>
  </div>
  <div class="splish triple" role="list">
    <ns-card role="listitem" type="section" decoration="gas">
      <h3 slot="heading">Sriracha hashtag fixie neutra</h3>
      <div slot="paragraph">
        <p>Twee cronut iceland la croix party listicle shaman.</p>
      </div>
      <a slot="cta" href="#!">
        <ns-cta type="direct">Distillery kinfolk</ns-cta>
      </a>
    </ns-card>
    <ns-card role="listitem" type="section" decoration="home">
      <h3 slot="heading">Organic</h3>
      <div slot="paragraph">
        <p>Bushwick tumeric before they sold out.</p>
      </div>
      <a slot="cta" href="#!">
        <ns-cta type="direct">Migas franzen drink</ns-cta>
      </a>
    </ns-card>
    <ns-card role="listitem" type="section" decoration="boiler">
      <h3 slot="heading">Bespoke stumptown</h3>
      <div slot="paragraph">
        <p>Knausgaard flannel organic tote bag prism pug.</p>
      </div>
      <a slot="cta" href="#!">
        <ns-cta type="direct">Art party</ns-cta>
      </a>
    </ns-card>
  </div>
</ns-panel>
```

Repeat the process, create other pages etc.

🤩

