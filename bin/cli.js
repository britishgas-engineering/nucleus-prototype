#!/usr/bin/env node

var shell = require("shelljs");
var parseArgs = require("minimist")

const prompts = require('prompts');
 
const questions = [
  {
    type: 'select',
    name: 'template',
    message: 'Pick a template to base your project on',
    choices: [
        { title: 'Multi Page Form', description: 'A form with multi parts.', value: 'multi-page-form' },
        { title: 'Single Page Colapsable Form', description: 'A journey with pages.', value: 'project' },
        { title: 'Foo Journey', description: 'A foo journey.', value: 'project' }
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
  for (var i=0; i<numForms; i++) {
    var newFile = projectPath + '/page-' + (i + 1) + '.njk';
    var nextForm = i < numForms - 1 ? 'page-' + (i + 2) : 'summary';
    shell.cp('-rf', '_templates/' + template + '/page-.njk', newFile);

    shell.ls(newFile).forEach(function (file) {
      shell.sed('-i', 'SURNAME', 'Page ' + (i + 1), file);
      shell.sed('-i', 'NEXT_FORM', nextForm, file);
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