const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const bcrypt = require('bcrypt-nodejs');
const omit = require('lodash/omit');

const UserSchema = new mongoose.Schema(
  {
    // profile details
    email: { type: 'string', required: true, unique: true },
    password: { type: 'string', select: false },
  },
  {
    collection: 'user',
  }
);

UserSchema.statics.createOne = async function (params) {
  const user = await this.create(params);
  return omit(user.toJSON(), ['password']);
};

UserSchema.pre('save', async function () {
  const user = await this.constructor.findOne({ email: this.email });
  if (user) {
    throw new Error('User already exists');
  }
  if (this.password) {
    this.password = bcrypt.hashSync(this.password);
  }
});

UserSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('User', UserSchema);
