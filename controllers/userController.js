const User = require('../models/userModel');
const { handleErrors } = require('./errorController');
const Joi = require('joi');

// Validation schema for creating a user
const userSchema = Joi.object({
  username: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  role: Joi.string().valid('user', 'admin').optional()
});

// Validation schema for updating a user
const userSchemaForUpdate = Joi.object({
  username: Joi.string().min(3).optional(),
  email: Joi.string().email().optional(),
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  role: Joi.string().valid('user', 'admin').optional()
});

// Create a new user
exports.createUser = handleErrors(async (req, res) => {
  //#swagger.tags=['User']
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'User details to create',
        required: true,
        schema: {
            username: 'sampleUser',
            email: 'sampleuser@example.com',
            firstName: 'Sample',
            lastName: 'User',
            role: 'user'
        }
    } */
  const { error } = userSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch {
    res.status(500).json({ error: 'Error creating user' });
  }
});

// Get a user by username
exports.getUser = handleErrors(async (req, res) => {
  //#swagger.tags=['User']
  //#swagger.parameters['username'] = { description: 'Username of the user to retrieve' }
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch {
    res.status(500).json({ error: 'Error fetching user' });
  }
});

// Update a user by username
exports.updateUser = handleErrors(async (req, res) => {
  //#swagger.tags=['User']
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'User details to update',
        schema: {
            username: 'updatedUser',
            email: 'updateduser@example.com',
            firstName: 'Updated',
            lastName: 'User',
            role: 'admin'
        }
    } */
  const { error } = userSchemaForUpdate.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const updatedUser = await User.findOneAndUpdate({ username: req.params.username }, req.body, {
      new: true
    });
    if (!updatedUser) return res.status(404).json({ error: 'User not found' });
    res.json(updatedUser);
  } catch {
    res.status(500).json({ error: 'Error updating user' });
  }
});

// Delete a user by username
exports.deleteUser = handleErrors(async (req, res) => {
  //#swagger.tags=['User']
  //#swagger.parameters['username'] = { description: 'Username of the user to delete' }
  try {
    const deletedUser = await User.findOneAndDelete({ username: req.params.username });
    if (!deletedUser) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch {
    res.status(500).json({ error: 'Error deleting user' });
  }
});
