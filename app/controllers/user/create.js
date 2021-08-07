const User = require('../../models/User');

const { ValidationError } = require('~helpers/extended-errors');

const controller = async (req, res) => {
  const { email, ...rest } = req.body;
  if (!email) {
    throw new ValidationError('Email cannot be blank');
  }
  const user = await User.createOne({ email, ...rest });
  return res.status(201).json(user);
};

module.exports = controller;
