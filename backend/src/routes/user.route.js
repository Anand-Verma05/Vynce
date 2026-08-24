import express from "express";
import {protectRoute} from "../middleware/auth.middleware.js"
import {getRecommendedUsers,getMyFriends,sendFriendRequest,acceptFriendRequest,getFriendRequests,getOutgoingFriendReqs,getUserProfile,updateProfile,removeFriend,rejectFriendRequest} from "../controllers/user.controller.js"
const router=express.Router();
router.use(protectRoute);


router.get("/",getRecommendedUsers);
router.get("/friends",getMyFriends);

router.post("/friend-request/:id",sendFriendRequest);
router.post("/friend-request/:id/accept",acceptFriendRequest);



router.get("/friend-requests",getFriendRequests);
router.get("/outgoing-friend-requests",getOutgoingFriendReqs);
router.get("/profile/:username",getUserProfile);

router.put("/profile",updateProfile);

router.delete("/friends/:id",removeFriend);
router.delete("/friend-request/:id",rejectFriendRequest);
export default router;