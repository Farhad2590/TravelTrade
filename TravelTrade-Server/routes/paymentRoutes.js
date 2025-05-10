const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const withdrawalController = require('../controllers/withdrawalController');

// Payment routes
router.post('/intent', paymentController.createPaymentIntent);
router.post('/confirm', paymentController.confirmPayment);
router.post('/payments', paymentController.createPayment);
router.get('/payments/history/:senderEmail', paymentController.getPaymentHistory);
router.get('/payments/earnings/:travelerEmail', paymentController.getEarnings);
router.get('/payments/admin', paymentController.getAllPayments);

// Withdrawal routes
router.post('/withdrawals', withdrawalController.createWithdrawal);
router.get('/withdrawals/:travelerEmail', withdrawalController.getWithdrawalsByTraveler);
router.get('/withdrawals/admin/all', withdrawalController.getAllWithdrawals);
router.patch('/withdrawals/:id/status', withdrawalController.updateWithdrawalStatus);

module.exports = router;