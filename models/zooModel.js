const mongoose = require('mongoose');

const zooSchema = new mongoose.Schema(
  {
    animalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Animal',
      required: true
    },
    location: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Zoo = mongoose.model('Zoo', zooSchema);

module.exports = Zoo;
