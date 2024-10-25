const { handleErrors } = require('./errorController');
const Joi = require('joi');
const Zoo = require('../models/zooModel');
const mongoose = require('mongoose');

// Validation schema for zoo animal
const zooAnimalSchema = Joi.object({
  animalId: Joi.string().required(),
  location: Joi.string().required()
});

// Validation schema for updating zoo animal location
const zooAnimalSchemaForUpdate = Joi.object({
  location: Joi.string().required()
});

// Get all animals in the zoo inventory
exports.getZooInventory = handleErrors(async (req, res) => {
  //#swagger.tags=['Zoo']
  try {
    const inventory = await Zoo.find();
    res.status(200).json(inventory);
  } catch {
    res.status(500).json({ error: 'Error fetching zoo inventory.' });
  }
});

// Get a single zoo animal by ID
exports.getZooAnimalById = handleErrors(async (req, res) => {
  //#swagger.tags=['Zoo']
  //#swagger.parameters['animalId'] = { description: 'ID of the animal in the zoo inventory' }
  const { animalId } = req.params;
  if (!mongoose.isValidObjectId(animalId)) {
    return res.status(400).json({ error: 'Invalid animal ID format.' });
  }

  try {
    const zooAnimal = await Zoo.findOne({ animalId });
    if (!zooAnimal) {
      return res.status(404).json({ error: 'Animal not found in inventory.' });
    }
    res.status(200).json(zooAnimal);
  } catch {
    res.status(500).json({ error: 'Error retrieving zoo animal.' });
  }
});

// Add a new animal to the zoo inventory
exports.addZooAnimal = handleErrors(async (req, res) => {
  //#swagger.tags=['Zoo']
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Zoo animal details to add',
        required: true,
        schema: {
            animalId: '12345',
            location: 'Section A'
        }
    } */
  const { error } = zooAnimalSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const { animalId, location } = req.body;
    const zooAnimal = new Zoo({ animalId, location });
    await zooAnimal.save();
    res.status(201).json(zooAnimal);
  } catch {
    res.status(500).json({ error: 'Error adding animal to zoo inventory.' });
  }
});

// Update zoo animal information by ID
exports.updateZooAnimal = handleErrors(async (req, res) => {
  //#swagger.tags=['Zoo']
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Zoo animal location details to update',
        schema: {
            location: 'Section B'
        }
    } */
  const { animalId } = req.params;
  const { error } = zooAnimalSchemaForUpdate.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const { location } = req.body;
    const zooAnimal = await Zoo.findOneAndUpdate(
      { animalId },
      { location },
      { new: true, runValidators: true }
    );
    if (!zooAnimal) {
      return res.status(404).json({ error: 'Animal not found in inventory.' });
    }
    res.status(200).json(zooAnimal);
  } catch {
    res.status(500).json({ error: 'Error updating zoo animal.' });
  }
});

// Delete an animal from the zoo inventory by ID
exports.deleteZooAnimal = handleErrors(async (req, res) => {
  //#swagger.tags=['Zoo']
  //#swagger.parameters['animalId'] = { description: 'ID of the animal to remove from the zoo inventory' }
  const { animalId } = req.params;
  try {
    const zooAnimal = await Zoo.findOneAndDelete({ animalId });
    if (!zooAnimal) {
      return res.status(404).json({ error: 'Animal not found in inventory.' });
    }
    res.status(200).json({ message: 'Animal removed from zoo inventory.' });
  } catch {
    res.status(500).json({ error: 'Error removing zoo animal.' });
  }
});
