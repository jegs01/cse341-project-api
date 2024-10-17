const mongoose = require('mongoose');

const animalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3
    },
    species: {
      type: String,
      required: true
    },
    habitat: {
      type: String,
      default: 'Unknown'
    },
    extinct: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Animal = mongoose.model('Animal', animalSchema);

module.exports = Animal;
