const { connectToDatabase, getObjectId } = require('../config/db');

class PaymentModel {
  static async getCollection() {
    const db = await connectToDatabase();
    return db.collection('tradeTravelPayments');
  }

  static async createPayment(paymentData) {
    const collection = await this.getCollection();
    return collection.insertOne(paymentData);
  }

  static async getPaymentsBySender(senderEmail) {
    const collection = await this.getCollection();
    return collection.find({ senderEmail }).toArray();
  }

  static async getPaymentsByTraveler(travelerEmail) {
    const collection = await this.getCollection();
    return collection.find({ travelerEmail, status: 'received' }).toArray();
  }

  static async getAllPayments() {
    const collection = await this.getCollection();
    return collection.find().toArray();
  }
}

module.exports = PaymentModel;