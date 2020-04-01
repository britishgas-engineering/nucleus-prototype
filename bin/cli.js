#!/usr/bin/env node

var forms = [{
    title: 'Welcome to your electric vehicle charger installation',
    description: 'This is a descripton',
    fields: [{
      name: 'title',
      label: 'Title:',
      type: 'select',
      options: `['Mr', 'Mrs', 'Ms']`
    }, {
      name: 'bg-customer',
      label: 'Are you a British Gas customer?:',
      type: 'radio',
      options: `['Yes', 'No']`
    }, {
      name: 'energy-type',
      label: 'What type of energy do you want?:',
      type: 'checkbox',
      options: `['Gas', 'Electricity', 'Both']`
    }, {
      name: 'firstname',
      label: 'First Name:',
      type: 'text'
    }, {
      name: 'surname',
      label: 'Surname:',
      type: 'text'
    }, {
      name: 'email',
      label: 'Email:',
      type: 'text',
      validation: `["isEmail"]`
    }]
  },
  {
    fields: [{
      name: 'car-make',
      label: 'Car Make:',
      type: 'select',
      options: `['Audi', 'BMW', 'Skoda']`
    }, {
      name: 'sort-code',
      label: 'Sort code:',
      type: 'text',
      mask: '00-00-00',
      separator: '-'
    }, {
      name: 'car-model',
      label: 'Car Model',
      type: 'text'
    }, {
      name: 'car-reg',
      label: 'Car registration number:',
      type: 'text'
    }]
  }
];


var shell = require("shelljs");
var parseArgs = require("minimist")

const prompts = require('prompts');

const questions = [{
    type: 'select',
    name: 'template',
    message: 'Pick a template to base your project on',
    choices: [{
        title: 'Multi Page Form',
        description: 'A form with multi parts.',
        value: 'multi-page-form'
      },
      {
        title: 'Single Page Colapsable Form',
        description: 'A journey with pages.',
        value: 'project'
      },
      {
        title: 'Foo Journey',
        description: 'A foo journey.',
        value: 'project'
      }
    ]
  },
  {
    type: 'number',
    name: 'numForms',
    message: 'How many forms do you want?'
  },
  {
    type: 'text',
    name: 'project',
    message: 'Enter the name for your new project?  Use lowercase letters, separate words with hyphens, eg: "my-project"',
    validate: (value) => value.length > 0 ? true : `Ypou didn't enter a name for your project`
  }
];

const go = (response) => {

  const command = args._[0] || 'g';
  const template = args._[1] || response.template;
  const project = args._[2] || response.project;
  const numForms = response.numForms || 1;

  console.log('Template ' + template);

  const projectPath = 'src/' + project;

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

  // Add numForms pages
  for (var i = 0; i < numForms; i++) {

    // Generate custom form templates
    if (forms[i]) {
      console.log(' GENERATING FORM ' + i);
      var content = `{% import "./../../inputters.njk" as inputter %}
      `;
      forms[i].fields.forEach((field) => {
        content += `{{ inputter.${field.type}('${field.name}', '${field.label}', '${field.validation}', ${field.options}, '${field.mask}', '${field.separator}') }}
        `;
        console.log('CONTENT ' + content);
      });
      // write content to form file
      var formFile = projectPath + '/_includes/form' + (i + 1) + '.njk';
      shell.ShellString(content).to(formFile);

    }


    var newFile = projectPath + '/page-' + (i + 1) + '.njk';
    var nextForm = i < numForms - 1 ? 'page-' + (i + 2) : 'summary';
    shell.cp('-rf', '_templates/' + template + '/page.njk', newFile);

    shell.ls(newFile).forEach(function (file) {
      shell.sed('-i', 'MODEL_PATH', 'model.form' + (i + 1), file);
      shell.sed('-i', 'NEXT_FORM', nextForm, file);
      // Only use custom form if it exists, otherwise just use page.njk template
      if (forms[i]) {
        shell.sed('-i', 'FORM_INCLUDE', `{% include "./_includes/form${i + 1}.njk" %}`, file);
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
    shell.sed('-i', 'PROJECT_NAME', project, file);
    shell.sed('-i', 'PROJECT_TITLE', formatProjectName(project), file);
  })

  shell.cd('../..');

  shell.cp('src/*.js', 'dist');

  // Generate project
  shell.exec("npx @11ty/eleventy --serve");

}

// Hard code
// var mock = {
//   project: 'ev',
//   numForms: 3,
//   template: 'multi-page-form'
// };
// let args = parseArgs(process.argv.slice(2));
// go(mock);


// Get params
let args = parseArgs(process.argv.slice(2));
// If no args then ask questions
if (args._.length === 0) {
  if (args._.length === 0) {
    const res = (async () => {
      const response = await prompts(questions);
      // Logic here
      //response.template = 'project';
      go(response);
      console.log(response); // => { value: 24 }
    })();
  }
} else {
  // Process with args
  go();
}

console.log(formatProjectName('andys-super-project'));

function formatProjectName(project) {
  return project.split('-').map((word) => {
    const arr = word.split('');
    arr[0] = arr[0].toUpperCase();
    return arr.join('');
  }).join(' ');
}