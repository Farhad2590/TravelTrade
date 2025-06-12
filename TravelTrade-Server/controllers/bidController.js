const BidModel = require("../models/bidModel");
const UserModel = require("../models/userModel");

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

      // First update the check status
      await BidModel.updateCheckStatus(bidId, status, checkImage);

      // Get the updated bid
      const bid = await BidModel.getBidById(bidId);

      // If status is "received", process payout with 90/10 split
      if (status === "received" && bid && bid.amount && !bid.payoutProcessed) {
        const totalAmount = parseFloat(bid.amount);
        const travelerEarnings = totalAmount * 0.9; // 90% to traveler
        const platformFee = totalAmount * 0.1; // 10% stays with admin

        // Deduct 90% from admin balance (traveler's share)
        await UserModel.deductAdminBalance(travelerEarnings);

        // Add 90% to traveler balance
        await UserModel.updateTravelerBalance(
          bid.travelerEmail,
          travelerEarnings
        );

        // Update bid with earnings info and mark as processed
        await BidModel.updateBidPayoutStatus(
          bidId,
          true,
          travelerEarnings,
          platformFee
        );
      }

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error updating check status:", error);
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

      // Get the bid first to check request_type and current status
      // const bid = await BidModel.getBidById(bidId);
      // if (!bid) {
      //   return res.status(404).json({ error: "Bid not found" });
      // }

      // // For send requests, override status if paymentDone was requested
      // if (bid.request_type === "send" && status === "paymentDone") {
      //   status = "payment_done_check_needed";
      // }

      const result = await BidModel.updateBidStatus(bidId, status);
      console.log(result);
      

      if (result.modifiedCount === 0) {
        return res.status(400).json({ error: "No changes made to bid" });
      }

      // Get the updated bid
      const updatedBid = await BidModel.getBidById(bidId);
      console.log(updatedBid);
      

      // Handle balance updates when status is "received" - 90/10 split
      if (
        status === "received" &&
        updatedBid.totalCost &&
        !updatedBid.payoutProcessed
      ) {
        const totalAmount = parseFloat(updatedBid.totalCost);
        const travelerEarnings = totalAmount * 0.9; // 90% to traveler
        const platformFee = totalAmount * 0.1; // 10% stays with admin
        console.log(totalAmount.travelerEarnings);
        
        console.log(`Processing payout for bid ${bidId}:`, {
          totalAmount,
          travelerEarnings,
          platformFee,
          travelerEmail: updatedBid.travelerEmail,
        });

        try {
          // Deduct 90% from admin balance (traveler's share)
          await UserModel.deductAdminBalance(travelerEarnings);

          // Add 90% to traveler balance
          await UserModel.updateTravelerBalance(
            updatedBid.travelerEmail,
            travelerEarnings
          );

          // Update bid with earnings info and mark as processed
          await BidModel.updateBidPayoutStatus(
            bidId,
            true,
            travelerEarnings,
            platformFee
          );

          console.log(`Payout processed successfully for bid ${bidId}`);
        } catch (balanceError) {
          console.error("Error processing balance updates:", balanceError);
          // Revert the status update if balance operations fail
          await BidModel.updateBidStatus(bidId, bid.status);
          throw balanceError;
        }
      }

      // Return the updated bid
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
