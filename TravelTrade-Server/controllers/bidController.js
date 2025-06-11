const BidModel = require("../models/bidModel");

const bidController = {
  createBid: async (req, res) => {
    try {
      const bid = req.body;
      const result = await BidModel.createBid(bid);
      res.status(201).json({
        success: true,
        bidId: result.insertedId,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to create bid" });
    }
  },

  getBidsInTravelerPosts: async (req, res) => {
    try {
      const travelerEmail = req.params.travelerEmail;
      const bids = await BidModel.getBidsInTravelerPosts(travelerEmail);
      res.status(200).json(bids);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bids" });
    }
  },

  getBidsByPost: async (req, res) => {
    try {
      const postId = req.params.postId;
      const bid = await BidModel.getBidsByPost(postId);
      if (!bid) {
        return res.status(404).json({ error: "No bid found for this post" });
      }
      res.status(200).json(bid);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bid" });
    }
  },

  getBidById: async (req, res) => {
    try {
      const bidId = req.params.bidId;
      const bid = await BidModel.getBidById(bidId);

      if (!bid) {
        return res.status(404).json({ error: "Bid not found" });
      }

      res.status(200).json(bid);
    } catch (error) {
      console.error("Error fetching bid:", error);
      res.status(500).json({ error: "Failed to fetch bid" });
    }
  },

  updateCheckStatus: async (req, res) => {
    try {
      const bidId = req.params.bidId;
      const { status, checkImage } = req.body;

      await BidModel.updateCheckStatus(bidId, status, checkImage);

      // Also update the main status if needed
      if (status === "parcel_Pickup") {
        await BidModel.updateBidStatus(bidId, status);
      }

      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update check status" });
    }
  },

  getAllBidsForAdmin: async (req, res) => {
    try {
      const bids = await BidModel.getAllBidsForAdmin();
      res.status(200).json(bids);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bids for admin" });
    }
  },

  updateBidStatus: async (req, res) => {
    try {
      const bidId = req.params.bidId;
      let { status } = req.body;

      // Get the bid first to check request_type
      const bid = await BidModel.getBidById(bidId);
      if (!bid) {
        return res.status(404).json({ error: "Bid not found" });
      }

      // For send requests, override status if paymentDone was requested
      if (bid.request_type === "send" && status === "paymentDone") {
        status = "payment_done_check_needed";
      }

      const result = await BidModel.updateBidStatus(bidId, status);

      if (result.modifiedCount === 0) {
        return res.status(400).json({ error: "No changes made to bid" });
      }

      // Return the updated bid
      const updatedBid = await BidModel.getBidById(bidId);
      res.status(200).json({ success: true, bid: updatedBid });
    } catch (error) {
      console.error("Error updating bid status:", error);
      res.status(500).json({ error: "Failed to update bid status" });
    }
  },

  getUserBids: async (req, res) => {
    try {
      const email = req.params.email;
      const bids = await BidModel.getUserBids(email);
      res.status(200).json(bids);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user bids" });
    }
  },
};

module.exports = bidController;
