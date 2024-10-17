const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/authenticate');
const animalController = require('../controllers/animalController');

router.get('/', animalController.getAllAnimals);

router.get('/:animalId', animalController.getAnimalById);

router.post('/', isAuthenticated, animalController.createAnimal);

router.put('/:animalId', isAuthenticated, animalController.updateAnimal);

router.delete('/:animalId', isAuthenticated, animalController.deleteAnimal);

router.get('/search', animalController.searchAnimals);

module.exports = router;
