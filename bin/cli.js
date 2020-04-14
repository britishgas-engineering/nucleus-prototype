#!/usr/bin/env node

var forms = [{
    title: 'Personal details',
    description: 'First we need to know a little bit about you',
    fields: [{
      name: 'title',
      label: 'Title:',
      type: 'select',
      options: `['Mr', 'Mrs', 'Ms']`,
      validation: `["isRequired"]`
    }, {
      name: 'firstname',
      label: 'First Name:',
      type: 'text',
      validation: `["isRequired"]`
    }, {
      name: 'surname',
      label: 'Surname:',
      type: 'text',
      validation: `["isRequired"]`
    }, {
      name: 'address',
      label: 'Address:',
      type: 'address'
    },
    {
      name: 'email',
      label: 'Email:',
      type: 'text',
      validation: `["isRequired", "isEmail"]`
    },
    {
      name: 'dob',
      label: 'Date of Birth:',
      type: 'date',
      validation: `["isRequired"]`
    }
  ]
  }, {
    title: 'Customer information',
    description: 'Let us know what type of energy you are interested in',
    fields: [{
      name: 'bg-customer',
      label: 'Are you a British Gas customer?:',
      type: 'radio',
      options: `['Yes', 'No']`,
      validation: `["isRequired"]`
    }, {
      name: 'energy-type',
      label: 'What type of energy would you like?:',
      type: 'checkbox',
      options: `['Gas', 'Electricity', 'Both']`,
      validation: `["isRequired"]`
    }]
  },
  {
    title: 'Pick a date for your home visit?',
    description: 'What date would you like an engineer to visit?',
    fields: [{
      name: 'appointment-date',
      label: 'Pick a date:',
      type: 'date'
    }]
  },
  {
    title: 'Your appointment',
    description: 'What time slot would you like to choose on ${model.form2.appointment-date}',
    fields: [{
      name: 'appointment-slot',
      label: 'Pick a time slot?:',
      type: 'radio',
      options: `['9am - 1pm', '1pm - 6pm', '10am - 2pm', '8am - 6pm']`,
      validation: `["isRequired"]`
    }]
  },
  {
    title: 'Your Vehicle',
    description: 'Tell us about your vehicle',
    fields: [{
      name: 'car-make',
      label: 'Car Make:',
      type: 'select',
      options: `['Audi', 'BMW', 'Skoda']`,
      validation: `["isRequired"]`
    }, {
      name: 'car-model',
      label: 'Car Model',
      type: 'text',
      validation: `["isRequired"]`
    }, {
      name: 'car-reg',
      label: 'Car registration number:',
      type: 'text',
      validation: `["isRequired"]`
    }]
  },
  {
    title: 'Payment Details',
    description: 'In order for us to set up this account we need your payment details',
    fields: [{
      title: 'Banking Details',
      description: 'This is a descripton',
      name: 'sort-code',
      label: 'Sort code:',
      type: 'text',
      mask: '00-00-00',
      separator: '-',
      validation: `["isRequired"]`
    },{
      name: 'account-number',
      label: 'Account number:',
      type: 'text',
      mask: '00000000',
      separator: '',
      validation: `["isRequired"]`
    },]
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
        title: 'Single Page Collapsible Form',
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

  // Multi page form puts each form on a new page
  var multiPage = template.indexOf('multi') !== -1;

  // NEW

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
      var pagePath = projectPath + '/page-' + (i + 1) + '.njk';
      var pageTemplate = projectPath + '/page.njk';
      shell.cp('-rf', pageTemplate, pagePath);

      var nextForm = i < forms.length - 1 ? 'page-' + (i + 2) : 'summary';

      // Add include to form
      shell.ls(pagePath).forEach(function (file) {
        shell.sed('-i', 'FORM_INCLUDE_PATH', `{% include "./form${(i + 1)}.njk" %}`, file);
        shell.sed('-i', 'NEXT_FORM', nextForm, file);
        shell.sed('-i', 'PAGE_TITLE', forms[i].title || '', file);
        shell.sed('-i', 'PAGE_TEXT', forms[i].description || '', file);
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
    shell.sed('-i', 'PROJECT_NAME', project, file);
    shell.sed('-i', 'PROJECT_TITLE', formatProjectName(project), file);
  })

  shell.cd('../..');

  shell.cp('src/*.js', 'dist');

  // Generate project
  shell.exec("npx @11ty/eleventy --serve");

}

// Hard code
var mock = {
  project: 'andy001',
  template: 'multi-page-form'
};
let args = parseArgs(process.argv.slice(2));
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