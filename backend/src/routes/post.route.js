import express from "express";

import {protectRoute} from "../middleware/auth.middleware.js";
import {createPost,getPosts,toggleLike,toggleSavePost,getSavedPosts,createComment,getPostComments,deletePost,deleteCommnet,getUserPosts} from "../controllers/post.controller.js";

const router=express.Router();

router.use(protectRoute);

router.post("/",createPost);
router.get("/",getPosts);
router.get("/saved",getSavedPosts);
router.post("/:id/like",toggleLike);
router.post("/:id/save",toggleSavePost);
router.post("/:id/comments",createComment);
router.get("/:id/comments",getPostComments);
router.delete("/:id",deletePost);
router.delete("/comments/:id",deleteCommnet);
router.get("/user/:userId",getUserPosts);

export default router;