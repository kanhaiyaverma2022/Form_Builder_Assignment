const express = require('express');
const { submitForm } = require('../controllers/formController');

const router = express.Router();

// Handle form submission
router.post('/:id', submitForm);

module.exports = router;