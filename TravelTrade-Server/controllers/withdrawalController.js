const WithdrawalModel = require('../models/withdrawalModel');
const UserModel = require('../models/userModel');

const withdrawalController = {
  createWithdrawal: async (req, res) => {
    try {
      const { travelerEmail, amount, bankDetails } = req.body;
      
      if (!travelerEmail || !amount || !bankDetails) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Check traveler balance (optional, handled in Model)
      const traveler = await UserModel.getUserByEmail(travelerEmail);
      if (!traveler) {
        return res.status(404).json({ error: 'Traveler not found' });
      }

      if (traveler.balance < amount) {
        return res.status(400).json({ error: 'Insufficient balance' });
      }

      const withdrawal = await WithdrawalModel.createWithdrawal({
        travelerEmail,
        amount,
        bankDetails,
      });

      res.status(201).json(withdrawal);
    } catch (error) {
      console.error('Create withdrawal error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  getWithdrawalsByTraveler: async (req, res) => {
    try {
      const { travelerEmail } = req.params;
      const withdrawals = await WithdrawalModel.getWithdrawalsByTraveler(travelerEmail);
      res.status(200).json(withdrawals);
    } catch (error) {
      console.error('Get withdrawals error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  getAllWithdrawals: async (req, res) => {
    try {
      const withdrawals = await WithdrawalModel.getAllWithdrawals();
      res.status(200).json(withdrawals);
    } catch (error) {
      console.error('Get all withdrawals error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  updateWithdrawalStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      // Get withdrawal details
      const withdrawal = await WithdrawalModel.getWithdrawalById(id);
      if (!withdrawal) {
        return res.status(404).json({ error: 'Withdrawal not found' });
      }

      // If status is "approved", deduct from traveler's balance
      if (status === 'approved') {
        await UserModel.updateUserBalance(
          withdrawal.travelerEmail,
          -withdrawal.amount
        );
      }

      // If status is "rejected", return money (if previously deducted)
      // (Optional, depending on your business logic)

      // Update withdrawal status
      await WithdrawalModel.updateWithdrawalStatus(id, status);

      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Update withdrawal status error:', error);
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = withdrawalController;