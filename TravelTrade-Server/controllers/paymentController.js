require('dotenv').config()
const PaymentModel = require('../models/paymentModel');
const BidModel = require('../models/bidModel');
const UserModel = require('../models/userModel');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const paymentController = {
  // Create payment intent with Stripe
  createPaymentIntent: async (req, res) => {
    try {
      const { amount } = req.body;
      
      if (!amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: 'usd',
        payment_method_types: ['card']
      });

      res.status(200).json({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    } catch (error) {
      console.error('Payment intent error:', error);
      res.status(500).json({ error: error.message });
    }
  },
  

  // Confirm payment and create booking
  confirmPayment: async (req, res) => {
    try {
      const { bookingData, paymentIntentId, paymentMethod } = req.body;

      // Verify payment with Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status !== 'succeeded') {
        return res.status(400).json({ error: 'Payment not completed' });
      }

      // Create booking
      const booking = await BookingModel.createBooking({
        ...bookingData,
        status: 'confirmed'
      });

      // Create payment record
      const payment = await PaymentModel.createPayment({
        bookingId: booking.insertedId,
        userId: bookingData.userId,
        providerId: bookingData.providerId,
        amount: bookingData.totalAmount,
        transactionId: paymentIntent.id,
        paymentMethod: 'card',
        status: 'completed'
      });

      res.status(201).json({
        booking,
        payment,
        message: 'Payment and booking confirmed'
      });

    } catch (error) {
      console.error('Payment confirmation error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  getPaymentHistory: async (req, res) => {
    try {
      const { senderEmail } = req.params;
      const payments = await PaymentModel.getPaymentsBySender(senderEmail);
      res.status(200).json(payments);
    } catch (error) {
      console.error('Get payment history error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Get earnings for traveler
  getEarnings: async (req, res) => {
    try {
      const { travelerEmail } = req.params;
      const payments = await PaymentModel.getPaymentsByTraveler(travelerEmail);
      
      const totalEarnings = payments.reduce((sum, payment) => {
        return sum + parseFloat(payment.amount);
      }, 0);

      res.status(200).json({ 
        payments,
        totalEarnings 
      });
    } catch (error) {
      console.error('Get earnings error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Get all payments for admin
  getAllPayments: async (req, res) => {
    try {
      const payments = await PaymentModel.getAllPayments();
      
      // Enrich payment data with bid and user information
      const enrichedPayments = await Promise.all(payments.map(async (payment) => {
        const bid = await BidModel.getBidsByPost(payment.orderId);
        const traveler = await UserModel.getUserByEmail(payment.travelerEmail);
        const sender = await UserModel.getUserByEmail(payment.senderEmail);
        
        return {
          ...payment,
          bidDetails: bid,
          travelerName: traveler ? traveler.name : 'Unknown',
          senderName: sender ? sender.name : 'Unknown'
        };
      }));

      res.status(200).json(enrichedPayments);
    } catch (error) {
      console.error('Get all payments error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  createPayment: async (req, res) => {
    try {
      const paymentData = req.body;
      const result = await PaymentModel.createPayment(paymentData);
      res.status(201).send(result);
    } catch (error) {
      console.error('Create payment error:', error);
      res.status(500).send({ error: error.message });
    }
  },
};

module.exports = paymentController;