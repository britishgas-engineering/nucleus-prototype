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
        { title: 'Multi Part Form', description: 'A form with multi parts.', value: 'project' },
        { title: 'Page Journey', description: 'A journey with pages.', value: 'project' },
        { title: 'Foo Journey', description: 'A foo journey.', value: 'project' }
    ]
  },
  {
    type: 'text',
    name: 'project',
    message: 'Enter the name for your new project?  Use lowercase letters, separate words with hyphens, eg: "my-project"',
    validate: (value) => value.length > 0 ? true : `Ypou didn't enter a name for your project`
  }
];

const go = (response) => {
  
  console.log('XXXXXXXXXX');
  
  const command = args._[0] || 'g';
  const template = args._[1] || response.template;
  const project = args._[2] || response.project;

  console.log('>>>>>> args ' + args._.length);
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

  // rename project.json
  shell.mv(projectPath + '/project.json', projectPath + '/' + project + '.json');

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
      response.template = 'project';
      go(response);
      console.log(response); // => { value: 24 }
    })();
  }
} else {
  // Process with args
  go();
}
