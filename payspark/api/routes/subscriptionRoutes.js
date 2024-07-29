const express = require('express');
const subscriptionController = require('../controllers/subscriptionController');

const router = express.Router();

router.post('/:id/subscribe', subscriptionController.subscribeUserToPlan);

module.exports = router;