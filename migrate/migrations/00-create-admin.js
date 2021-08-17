// eslint-disable-next-line import/no-extraneous-dependencies
const inquirer = require('inquirer');

const User = require('../../app/models/User');
const Admin = require('../../app/models/Admin');

const up = async () => {
  const questions = [
    {
      type: 'input',
      name: 'name',
      message: 'Enter your full name: ',
    },
    {
      type: 'input',
      name: 'email',
      message: 'Enter your email: ',
    },
    {
      type: 'password',
      name: 'password',
      message: 'Enter a password for your account: ',
    },
  ];
  const answers = await inquirer.prompt(questions);
  const { name, username, email, password } = answers;
  const user = await User.createOne({
    name,
    username,
    email,
    password,
  });
  await Admin.create({ user: user.id, roles: ['superadmin'] });
  console.log('Added a new user and added as superadmin');
};

const down = async () => {
  console.log('No down for create admin migration');
};

module.exports = { up, down };
