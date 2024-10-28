const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true },
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role: { type: String, default: 'user' }
  },
  { timestamps: true }
);

// Static method to check if a username already exists
userSchema.statics.isUsernameExists = async function (username) {
  return await this.findOne({ username });
};

// Static method to check if an email already exists
userSchema.statics.isEmailExists = async function (email) {
  return await this.findOne({ email });
};

module.exports = mongoose.model('User', userSchema);
