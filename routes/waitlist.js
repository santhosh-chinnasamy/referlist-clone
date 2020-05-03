const express = require('express');
const router = express.Router();
const userController = require('@app/controllers/user');
const listController = require('@app/controllers/waitlist');

router.post('/join/:domain', listController.addusertolist);
router.post('/referlist', listController.updatereferral);

router.post('/createlist', listController.createlist);
router.post('/readlist', listController.readlist);
router.post('/editlist', listController.editlist);
router.post('/deletelist', listController.deletelist);
router.post('/getall', listController.getlists);

module.exports = router;