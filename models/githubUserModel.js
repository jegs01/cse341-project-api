const mongoose = require('mongoose');

const githubUserSchema = new mongoose.Schema(
  {
    githubId: {
      type: String,
      required: true,
      unique: true
    },
    username: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const GithubUser = mongoose.model('GithubUser', githubUserSchema);

module.exports = GithubUser;
