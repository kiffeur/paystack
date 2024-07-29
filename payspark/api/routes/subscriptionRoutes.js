const express = require('express');
const subscriptionController = require('../controllers/subscriptionController');

const router = express.Router();

router.post('/:id/subscribe', subscriptionController.subscribeUserToPlan);
//router.get('/:id/subscriptions', userSubscriptions.userSubscriptions);

module.exports = router;
