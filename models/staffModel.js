const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema(
  {
    staffId: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    position: { type: String, required: true },
    department: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    hireDate: { type: Date, required: true }
  },
  { timestamps: true }
);

// Static method to check if a staff member exists by staffId
staffSchema.statics.isStaffIdExists = async function (staffId) {
  return await this.findOne({ staffId });
};

// Static method to check if a staff member exists by email
staffSchema.statics.isEmailExists = async function (email) {
  return await this.findOne({ email });
};

module.exports = mongoose.model('Staff', staffSchema);
