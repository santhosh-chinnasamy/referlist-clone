const express = require('express');
const router = express.Router();
const auth = require('../_helpers/authentication').Auth;
const listController = require('../controllers/waitlist');
const validation = require('../_helpers/validation');

router.post('/createlist', auth, validation.validate_list, listController.createlist);
router.post('/readlist/:list_id', auth, listController.readlist);
router.post('/editlist', auth, validation.validate_list, listController.editlist);
router.post('/deletelist/:id', auth, listController.deletelist);
router.post('/getall', auth, listController.getalllist);

router.post('/join/:domain', listController.joinlist);
router.post('/referlist', listController.referlist);

module.exports = router;