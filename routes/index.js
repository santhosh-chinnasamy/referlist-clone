const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const validation = require('../_helpers/validation');

router.post('/signup', userController.signup);
router.post('/login', validation.validate_login,userController.login);

module.exports = router;