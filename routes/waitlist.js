const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const listController = require('../controllers/waitlist');

router.post('/createlist', listController.createlist);
router.post('/readlist/:id', listController.readlist);
router.post('/editlist', listController.editlist);
router.post('/deletelist/:id', listController.deletelist);

router.post('/join/:domain', listController.joinlist);
router.post('/referlist', listController.referlist);
/* 
router.post('/getall', listController.getlists);
 */
module.exports = router;