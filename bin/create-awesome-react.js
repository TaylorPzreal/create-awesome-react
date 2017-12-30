#!/usr/bin/env node

const chalk = require('chalk');
const commander = require('commander');
const packageJSON = require('../package.json');

process.title = 'create-awesome-react';
let projectName;

const program = new commander
  .Command(packageJSON.name)
  .version(packageJSON.version)
  .arguments('<project-directory>')
  .usage(`${chalk.blue('<project-directory>')} [options]`)
  .action((name) => {
    projectName = name;
  })
  .allowUnknownOption()
  .on('--help', () => {
    console.log(`    Only ${chalk.green('<project-directory>')} is required.`);
    console.log();
    console.log(
      `    If you have any problems, do not hesitate to file an issue:`
    );
    console.log(
      `    ${chalk.cyan(
        'https://github.com/TaylorPzreal/create-awesome-react/issues/new'
      )}`
    );
    console.log();
  })
  .parse(process.argv);

if (!projectName) {
  console.error('Please specify the project directory:');
  console.log(
    `Run ${chalk.cyan(`${program.name()} --help`)} to see all options.`
  );
  process.exit(1);
}
