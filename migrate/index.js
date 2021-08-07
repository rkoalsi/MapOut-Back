/* eslint-disable import/no-extraneous-dependencies */
require('dotenv').config();

const moduleAlias = require('module-alias');
const { argv } = require('yargs');
const Umzug = require('umzug');
const path = require('path');
const chalk = require('chalk');

const { mongooseInit } = require('../app/helpers/init-service');

moduleAlias(path.resolve(__dirname, '..', 'package.json'));

function migName(file) {
  return path.basename(file, '.js');
}

const defaultGroupName = 'migrations';

async function initUmzug() {
  const mongooseInstance = await mongooseInit();
  const { connection } = mongooseInstance;
  const umzug = new Umzug({
    storage: 'mongodb',
    storageOptions: {
      connection,
      collectionName: argv.group ? `__${argv.group}` : `__${defaultGroupName}`,
    },
    migrations: {
      params: [connection],
      path: `migrate/${argv.group ? argv.group : defaultGroupName}`,
      pattern: /\.js$/,
    },
  });

  umzug.on('migrating', (name) => {
    console.log(chalk`{blue [Migrating]} {bold ${name}}`);
  });
  umzug.on('migrated', (name) => {
    console.log(chalk`{blue [Migrated]} {bold ${name}}`);
  });
  umzug.on('reverting', (name) => {
    console.log(chalk`{blue [Reverting]} {bold ${name}}`);
  });
  umzug.on('reverted', (name) => {
    console.log(chalk`{blue [Reverted]} {bold ${name}}`);
  });

  return umzug;
}

async function cmdList(umzug) {
  const executed = await umzug.executed();
  executed.forEach((e) => {
    console.log(chalk.green(`Executed - ${migName(e.file)}`));
  });
  const pending = await umzug.pending();
  pending.forEach((p) => {
    console.log(chalk.yellow(`Pending - ${migName(p.file)}`));
  });
}

async function cmdUpNext(umzug) {
  const pending = await umzug.pending();
  if (pending.length === 0) {
    throw new Error('No migrations to execute');
  } else {
    const to = migName(pending[0].file);
    return umzug.up({ to });
  }
}

async function cmdUpAll(umzug) {
  return umzug.up();
}

async function cmdDownPrev(umzug) {
  const executed = await umzug.executed();
  if (executed.length === 0) {
    throw new Error('No migrations to revert');
  } else {
    const to = migName(executed[executed.length - 1].file);
    return umzug.down({ to });
  }
}

async function cmdDownAll(umzug) {
  return umzug.down({ to: 0 });
}

async function executeCmd(umzug) {
  const cmd = argv._[0];
  let executedCmd;
  switch (cmd) {
    case 'list':
      executedCmd = cmdList(umzug);
      break;

    case 'up':
    case 'next':
      executedCmd = cmdUpNext(umzug);
      break;

    case '':
    case 'up-all':
      executedCmd = cmdUpAll(umzug);
      break;

    case 'down':
    case 'prev':
      executedCmd = cmdDownPrev(umzug);
      break;

    case 'down-all':
    case 'revert':
      executedCmd = cmdDownAll(umzug);
      break;

    default:
      console.log(`Invalid cmd: ${cmd}`);
      process.exit(1);
  }

  try {
    await executedCmd;
    console.log(chalk.bold`-- Done --`);
  } catch (err) {
    console.log(chalk.red`-- Error --`);
    console.error(chalk.red(err.stack));
  }
}

async function main() {
  const umzug = await initUmzug();
  await executeCmd(umzug);
  process.exit(0);
}

main();
