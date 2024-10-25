const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/authenticate');
const userController = require('../controllers/userController');

router.post('/', isAuthenticated, userController.createUser);
router.get('/:username', userController.getUser);
router.put('/:username', isAuthenticated, userController.updateUser);
router.delete('/:username', isAuthenticated, userController.deleteUser);

module.exports = router;
