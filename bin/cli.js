#!/usr/bin/env node

console.log('Hello');
var shell = require("shelljs");
var parseArgs = require("minimist")

go();

function go() {

  // Delete dist
  shell.rm('-rf', 'dist/*')

  // Get params
  let args = parseArgs(process.argv.slice(2));
  const command = args._[0];
  const template = args._[1];
  const project = args._[2];

  console.log('>>>>>> args ' + args._.length);
  const projectPath = 'src/' + project;

  if (!command) {
    console.log('No command was entered.  Supported commnads are g (generate) only.');
    return;
  }
  if (!template) {
    console.log('No template was entered.  You must chose a template to base your project from.  eg "project"');
    return;
  }
  if (!project) {
    console.log('No project name was entered.  You must chose a new name for your project.');
    return;
  }
  
  // Copy template project to new project
  shell.rm('-rf', projectPath)
  shell.mkdir(projectPath);
  shell.cp('-rf', '_templates/' + template + '/*', projectPath);

  // rename project.json
  shell.mv(projectPath + '/project.json', projectPath + '/' + project + '.json');

  // Generate project
  shell.exec("npx @11ty/eleventy --serve");

}



