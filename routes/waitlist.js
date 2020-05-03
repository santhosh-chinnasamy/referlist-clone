const express = require('express');
const router = express.Router();
const auth = require('../_helpers/authentication').Auth;
const listController = require('../controllers/waitlist');

router.post('/createlist', auth, listController.createlist);
router.post('/readlist/:list_id', auth, listController.readlist);
router.post('/editlist', auth, listController.editlist);
router.post('/deletelist/:id', auth, listController.deletelist);
router.post('/getall', auth, listController.getalllist);

router.post('/join/:domain', listController.joinlist);
router.post('/referlist', listController.referlist);

module.exports = router;