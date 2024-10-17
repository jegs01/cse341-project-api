const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/authenticate');
const zooController = require('../controllers/zooController');

router.get('/', zooController.getZooInventory);

router.get('/:animalId', zooController.getZooAnimalById);

router.post('/', isAuthenticated, zooController.addZooAnimal);

router.put('/:animalId', isAuthenticated, zooController.updateZooAnimal);

router.delete('/:animalId', isAuthenticated, zooController.deleteZooAnimal);

module.exports = router;
