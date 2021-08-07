const User = require('../../models/User');

module.exports = async (req, res) => {
  const allUsers = await User.find();
  return res.status(200).json(allUsers);
};
