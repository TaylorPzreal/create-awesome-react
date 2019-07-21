#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const commander = require('commander');
const chalk = require('chalk');
const { execSync } = require('child_process');
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
  .option('-v, --verbose', 'print additional logs')
  .option('-m, --package-manager [pkg]', 'select package manager (yarn|npm) to use')
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
  console.error(chalk.red('Please specify the project directory:'));
  console.log();
  console.warn(`${chalk.green('create-awesome-react')} <project-directory>\n`);
  console.log(
    `Run ${chalk.cyan(`${program.name()} -h`)} to see all options.\n`
  );
  process.exit(1);
}

createAwesomeReact(projectName);

function createAwesomeReact(name) {
  const root = path.resolve(name);
  const appName = path.basename(root);
  const PACKAGE_NAME = 'awesome-react';
  const useYarn = shouldUseYarn();
  console.log(`use ${useYarn ? chalk.green('yarn'): chalk.green('npm')}`);

  fs.ensureDirSync(name);
  execSync(useYarn ? 'yarn'  : 'npm install');
  process.chdir(root);

  const installCommand = generateInstallCommand(PACKAGE_NAME, useYarn);
  
  console.log();
  console.warn(`Creating project structure in ${chalk.blue(root)}`);
  console.warn('Please wait a minute...');
  console.log('Installing awesome-react...');
  execSync(installCommand);
  console.warn(chalk.green('awesome-react Installed.\n'));

  console.warn(chalk.yellow('Now dealing data ... wait a minute'));
  fs.copySync(`${root}/node_modules/${PACKAGE_NAME}`, root);
  fs.removeSync(`${root}/node_modules`);

  // install packages
  console.log(chalk.blue('Installing packages...'));
  const verbose = program.verbose ? '--verbose' : '';
  execSync(useYarn ? `yarn ${verbose}` : `npm install ${verbose}`);

  console.log('Packages installed.');
  console.warn(chalk.green(`creat ${appName} success.`), '\n');

  afterInstalled(appName);
}

function afterInstalled(appName) {
  console.warn('We suggest that you begin by typing:');
  console.warn(chalk.green('cd'), appName);
  console.warn(chalk.green('yarn start or npm start'), '\n');
}

function shouldUseYarn() {
  try {
    execSync('yarnpkg --version', {stdio: 'ignore'});
    const PM = program.packageManager;
    let useYarn = true;

    if (PM) {
      useYarn = PM === 'yarn';
    }

    return useYarn;
  } catch (e) {
    return false;
  }
}

function generateInstallCommand(PACKAGE_NAME, useYarn) {
  const verbose = program.verbose ? '--verbose' : '';

  return useYarn
    ? `yarn add ${PACKAGE_NAME} ${verbose}`
    : `npm install ${PACKAGE_NAME} ${verbose}`;
}
