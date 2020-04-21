#!/usr/bin/env node

var shell = require("shelljs");
var parseArgs = require("minimist");
const fs = require('fs');

var args = parseArgs(process.argv.slice(2));
const configFile = args._[0];
if (configFile) {
  console.log('Arg ' + configFile);
}

let data = fs.readFileSync(`src/${configFile}/config.json`);
let journey = JSON.parse(data);

// Help and support
var mock = {
  project: journey.name,
  template: journey.template,
  title: journey.title
};


const go = (response) => {

  forms = journey.pages;

  const command = args._[0] || 'g';
  const template = args._[1] || response.template;
  const project = args._[2] || response.project;

  console.log('Template ' + template);

  const projectPath = 'cli-build/' + project;

  if (!command) {
    console.log('No command was entered.  Supported commands are: g (generate) only.');
    return;
  }
  if (!template) {
    console.log('No template was entered.  You must choose a template to base your project on.  eg "project"');
    return;
  }
  if (!project) {
    console.log('No project name was entered.  You must chose a new name for your project.');
    return;
  }

  // Delete dist
  shell.rm('-rf', 'dist/*')

  // Copy template project to new project
  shell.rm('-rf', projectPath)
  shell.mkdir(projectPath);
  shell.cp('-rf', '_templates/' + template + '/*', projectPath);

  // Multi page form puts each form on a new page
  var multiPage = template.indexOf('multi') !== -1;

  // Generate individual Form Field templates
  for (var i = 0; i < forms.length; i++) {
    var content = `{% import "./../inputters.njk" as inputter %}
    `;
    // GENERATE FORM CONTENT
    forms[i].fields.forEach((field) => {
      content += `{{ inputter.${field.type}('${field.name}', '${field.label}', '${field.validation}', ${field.options}, '${field.mask}', '${field.separator}') }}
      `;
      console.log('CONTENT ' + content);
    });

    // Always save each form to a new form template
    var formFile = projectPath + '/form-fields' + (i + 1) + '.njk';
    shell.ShellString(content).to(formFile);
    // Reset content
    content = `{% import "./../../inputters.njk" as inputter %}
    `;
  }

  // Generate individual Form templates
  if (multiPage) {
    for (var i = 0; i < forms.length; i++) {
      // Create a new form for each form
      var pageTemplate = projectPath + '/form.njk';
      var pagePath = projectPath + '/form' + (i + 1) + '.njk';
      shell.cp('-rf', pageTemplate, pagePath);

      // Add include to form
      shell.ls(pagePath).forEach(function (file) {
        shell.sed('-i', 'FORM_FIELDS_PATH', `{% include "./form-fields${(i + 1)}.njk" %}`, file);
        shell.sed('-i', 'MODEL_PATH', 'model.form' + (i + 1), file);
      });
    }
  } else {
    // place all fields into FORM_FIELDS_PATH
    // Create a new form for each form
    // var pagePath = projectPath + '/form1.njk';
    // var pageTemplate = projectPath + '/form.njk';
    // shell.cp('-rf', pageTemplate, pagePath);

    for (var i = 0; i < forms.length; i++) {
      // Create a new form for each form
      var pagePath = projectPath + '/form' + (i + 1) + '.njk';
      var pageTemplate = projectPath + '/form.njk';
      shell.cp('-rf', pageTemplate, pagePath);

      // Add include to form
      shell.ls(pagePath).forEach(function (file) {
        shell.sed('-i', 'FORM_FIELDS_PATH', `{% include "./form-fields${(i + 1)}.njk" %}`, file);
        shell.sed('-i', 'MODEL_PATH', 'model.form' + (i + 1), file);
        shell.sed('-i', 'PAGE_TITLE', forms[i].title || '', file);
        shell.sed('-i', 'PAGE_TEXT', forms[i].description || '', file);
      });
    }


    // Add form fields to eache form
    shell.ls(pagePath).forEach(function (file) {
      for (var i = 0; i < forms.length; i++) {
        shell.sed('-i', 'FORM_FIELDS_PATH', `{% include "./form-fields${(i + 1)}.njk" %}`, file);
        shell.sed('-i', 'MODEL_PATH', 'model.form' + (i + 1), file);
      }

    });
  }

  // Generate individual Page templates
  if (multiPage) {
    for (var i = 0; i < forms.length; i++) {
      // Create a new page for each form
      var pageName = forms[i].name;
      var pagePath = projectPath + `/${pageName}.njk`;
      var pageTemplate = projectPath + '/page.njk';
      shell.cp('-rf', pageTemplate, pagePath);

      var nextForm = i < forms.length - 1 ? forms[i + 1].name : 'summary';
      var customPageScript = `../${pageName}.js`;

      // Copy script to relevant folder
      shell.cp('-rf', `src/${project}/scripts/${pageName}.js`, `${projectPath}`);

      // Add include to form
      shell.ls(pagePath).forEach(function (file) {
        shell.sed('-i', 'FORM_INCLUDE_PATH', `{% include "./form${(i + 1)}.njk" %}`, file);
        shell.sed('-i', 'NEXT_FORM', nextForm, file);
        shell.sed('-i', 'PAGE_TITLE', forms[i].title || '', file);
        shell.sed('-i', 'PAGE_TEXT', forms[i].description || '', file);
        shell.sed('-i', 'CUSTOM_PAGE_SCRIPT', customPageScript, file);
      });

    }
  } else {
    // Create a new page for each form
    var pagePath = projectPath + '/page-1.njk';
    var pageTemplate = projectPath + '/page.njk';
    shell.cp('-rf', pageTemplate, pagePath);

    var content = '';
    // Add include to form
    for (var i = 0; i < forms.length; i++) {
      content += `{% include "./form${(i + 1)}.njk" %}\n`;
    }

    shell.ls(pagePath).forEach(function (file) {
      shell.sed('-i', 'FORM_INCLUDE_PATH', content, file);
      shell.sed('-i', 'NEXT_FORM', 'summary', file);
      shell.sed('-i', 'MODEL_PATH', 'model.form1', file);
      for (var i = 0; i < forms.length; i++) {
        shell.sed('-i', 'PAGE_TITLE', forms[i].title || '', file);
        shell.sed('-i', 'PAGE_TEXT', forms[i].description || '', file);
      }
    });

  }

  // rename project.json
  shell.mv(projectPath + '/project.json', projectPath + '/' + project + '.json');

  shell.cd(projectPath);

  // set front matter
  shell.ls('*.njk').forEach(function (file) {
    shell.sed('-i', 'PROJECT_NAME', response.title, file);
    shell.sed('-i', 'PROJECT_TITLE', formatProjectName(project), file);
    shell.sed('-i', 'START_JOURNEY_BUTTON', 'Start your quote!!!!', file);

  })

  shell.cd('../..');

  shell.cp('cli-build/*.js', 'dist');

  // Generate project
  shell.exec("npx @11ty/eleventy");

  shell.ls(`${projectPath}/*.js`).forEach(function (file) {
    console.log('COPY JS ' + file);
    shell.cp('-rf', file, 'dist/help');
  })

  shell.exec("npx @11ty/eleventy --serve");

}

var args = parseArgs(process.argv.slice(2));
go(mock);


// Get params
// let args = parseArgs(process.argv.slice(2));
// // If no args then ask questions
// if (args._.length === 0) {
//   if (args._.length === 0) {
//     const res = (async () => {
//       const response = await prompts(questions);
//       // Logic here
//       //response.template = 'project';
//       go(response);
//       console.log(response); // => { value: 24 }
//     })();
//   }
// } else {
//   // Process with args
//   go();
// }

function formatProjectName(project) {
  return project.split('-').map((word) => {
    const arr = word.split('');
    arr[0] = arr[0].toUpperCase();
    return arr.join('');
  }).join(' ');
}