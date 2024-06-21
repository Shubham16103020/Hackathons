const express = require('express');
const router = express.Router();
const moduleController = require('../controllers/moduleController');

// Route to add a new module type
router.post('/', moduleController.addModuleType);

module.exports = router;
