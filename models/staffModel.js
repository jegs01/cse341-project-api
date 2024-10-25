const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema(
  {
    staffId: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    position: { type: String, required: true },
    department: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Staff', staffSchema);
