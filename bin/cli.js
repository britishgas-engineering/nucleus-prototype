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

const projectPath = 'src/projects/' + project;
shell.rm('-rf', projectPath)
shell.mkdir(projectPath);
shell.cp('-rf', 'src/_templates/project/*', projectPath);

shell.cd(projectPath);
// shell.ls('*.*').forEach(function (file) {
//   shell.sed('-i', 'PAGE_TITLE', 'New Title for ' + project, file);
//   shell.sed('-i', 'SITE_NAME', project, file);
// });
shell.cd('..');

console.log('command ' + command);