#!/usr/bin/env node

console.log('Hello');
var shell = require("shelljs");
var parseArgs = require("minimist")

shell.exec("echo shell.exec works");

//import shell from 'shelljs';
//import parseArgs from 'minimist';

let args = parseArgs(process.argv.slice(2));
const command = args._[0];

const project = 'my-demo';

// Delete dist
shell.rm('-rf', 'dist/*')


const projectPath = 'src/' + project;
shell.rm('-rf', projectPath)
shell.mkdir(projectPath);
shell.cp('-rf', '_templates/project/*', projectPath);

// rename project.json
shell.mv(projectPath + '/project.json', projectPath + '/' + project + '.json');

shell.cd(projectPath);
// shell.ls('*.*').forEach(function (file) {
//   shell.sed('-i', 'PAGE_TITLE', 'New Title for ' + project, file);
//   shell.sed('-i', 'SITE_NAME', project, file);
// });
shell.cd('../..');

// Generate project
shell.exec("npx @11ty/eleventy --serve");

console.log('>>>>>> command ' + command);