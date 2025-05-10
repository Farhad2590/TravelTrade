const { connectToDatabase, getObjectId } = require("../config/db");

class UserModel {
  static async getCollection() {
    const db = await connectToDatabase();
    return db.collection("tradeTravelUsers");
  }

  static async getAllUsers() {
    const collection = await this.getCollection();
    return collection.find().toArray();
  }

  static async getUserByEmail(email) {
    const collection = await this.getCollection();
    return collection.findOne({ email });
  }

  static async getVerificationByEmail(email) {
    const collection = await this.getCollection();
    const user = await collection.findOne({ email });
    return user?.verificationData || null;
  }
  static async updateVerificationStatus(email, status) {
    const collection = await this.getCollection();
    return collection.updateOne(
      { email },
      {
        $set: {
          "verificationData.status": status,
          verificationStatus: status,
        },
      }
    );
  }

  static async getUserById(id) {
    const collection = await this.getCollection();
    return collection.findOne({ _id: getObjectId(id) });
  }

  static async createUser(user) {
    const collection = await this.getCollection();
    return collection.insertOne(user);
  }

  static async deleteUser(id) {
    const collection = await this.getCollection();
    return collection.deleteOne({ _id: getObjectId(id) });
  }

  static async updateUserRole(email, role) {
    const collection = await this.getCollection();
    return collection.updateOne({ email }, { $set: { role } });
  }

  static async checkAdminStatus(email) {
    const collection = await this.getCollection();
    const user = await collection.findOne({ email });
    return { admin: user?.role === "admin" };
  }

  static async checkTravelerStatus(email) {
    const collection = await this.getCollection();
    const user = await collection.findOne({ email });
    return { traveler: user?.role === "traveler" };
  }

  static async checkSenderStatus(email) {
    const collection = await this.getCollection();
    const user = await collection.findOne({ email });
    return { sender: user?.role === "sender" };
  }

  static async updateUserByEmail(email, updateData) {
    const collection = await this.getCollection();
    return collection.updateOne({ email }, { $set: updateData });
  }

  static async addReview(email, reviewData) {
    const collection = await this.getCollection();
    return collection.updateOne(
      { email },
      { $push: { reviews: reviewData } }
    );
  }
}

module.exports = UserModel;
