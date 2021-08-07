const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const bcrypt = require('bcrypt-nodejs');
const omit = require('lodash/omit');
const User = require('./User');

const { createJWT } = require('../helpers/jwt-service');

const AdminSchema = new mongoose.Schema(
  {
    user: {
      type: 'ObjectId',
      ref: 'User',
      required: true,
      unique: true,
    },
    roles: {
      type: ['string'],
      default: ['admin'],
    },
  },
  {
    collection: 'admin',
  }
);

AdminSchema.statics.authenticate = async function (email, password) {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new Error('User does not exist');
  }

  const match = bcrypt.compareSync(password, user.password);
  if (!match) {
    throw new Error('Password is incorrect');
  }

  const admin = await this.findOne({ user: user.id });
  if (!admin) {
    throw new Error('User is not admin');
  }

  const token = await createJWT(
    { ...omit(user.toJSON(), ['password']), admin },
    process.env.ADMIN_AUTH_SECRET,
    { expiresIn: '1d' }
  );

  return token;
};

AdminSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Admin', AdminSchema);
