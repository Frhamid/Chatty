import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getMyFriends,
  getrecomendedusers,
  sendFriendRequest,
  acceptFriendRequest,
  getFriendRequests,
  getSentFriendRequests,
  rejectFriendRequest,
} from "../controllers/users.controller.js";
const router = express.Router();

router.use(protectRoute);

//getting all the users that are currently not friends
router.get("/", getrecomendedusers);

//endpoint for getting all the users that are friends
router.get("/friends", getMyFriends);

//endpoint for sending the request
router.post("/friend-request/:id", sendFriendRequest);

//endpoint for accepting the friend request
router.put("/friend-request/:id/accept", acceptFriendRequest);

//enpoint for deleting/rejecting friend request
router.delete("/friend-request/:id/reject", rejectFriendRequest);

//end point for fetching the requests received that are pending(yet to be accepted)
router.get("/friend-request", getFriendRequests);

//end point for getting all the sent requests
router.get("/friend-request_sent", getSentFriendRequests);

export default router;
