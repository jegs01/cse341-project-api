const Staff = require('../models/staffModel');
const { handleErrors } = require('./errorController');
const Joi = require('joi');

// Validation schema for creating a staff member
const staffSchema = Joi.object({
  staffId: Joi.string().required(),
  name: Joi.string().min(2).required(),
  position: Joi.string().required(),
  department: Joi.string().required()
});

// Validation schema for updating a staff member
const staffSchemaForUpdate = Joi.object({
  staffId: Joi.string().optional(),
  name: Joi.string().min(2).optional(),
  position: Joi.string().optional(),
  department: Joi.string().optional()
});

// Create a new staff member
exports.createStaff = handleErrors(async (req, res) => {
  //#swagger.tags=['Staff']
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Staff member details to create',
        required: true,
        schema: {
            staffId: 'STF001',
            name: 'John Doe',
            position: 'Manager',
            department: 'Sales'
        }
    } */
  const { error } = staffSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const newStaff = await Staff.create(req.body);
    res.status(201).json(newStaff);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all staff members
exports.getAllStaff = handleErrors(async (req, res) => {
  //#swagger.tags=['Staff']
  try {
    const staffMembers = await Staff.find();
    res.json(staffMembers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a staff member by ID
exports.getStaffById = handleErrors(async (req, res) => {
  //#swagger.tags=['Staff']
  //#swagger.parameters['staffId'] = { description: 'ID of the staff member to retrieve' }
  try {
    const staff = await Staff.findOne({ staffId: req.params.staffId });
    if (!staff) return res.status(404).json({ error: 'Staff not found' });
    res.json(staff);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Update a staff member by ID
exports.updateStaff = handleErrors(async (req, res) => {
  //#swagger.tags=['Staff']
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Staff member details to update',
        schema: {
            staffId: 'STF002',
            name: 'Jane Comfort',
            position: 'Team Lead',
            department: 'Marketing'
        }
    } */
  const { error } = staffSchemaForUpdate.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const updatedStaff = await Staff.findOneAndUpdate({ staffId: req.params.staffId }, req.body, {
      new: true
    });
    if (!updatedStaff) return res.status(404).json({ error: 'Staff not found' });
    res.json(updatedStaff);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a staff member by ID
exports.deleteStaff = handleErrors(async (req, res) => {
  //#swagger.tags=['Staff']
  //#swagger.parameters['staffId'] = { description: 'ID of the staff member to delete' }
  try {
    const deletedStaff = await Staff.findOneAndDelete({ staffId: req.params.staffId });
    if (!deletedStaff) return res.status(404).json({ error: 'Staff not found' });
    res.json({ message: 'Staff deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
