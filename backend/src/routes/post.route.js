import express from "express";

import {protectRoute} from "../middleware/auth.middleware.js";
import {createPost,getPosts,toggleLike,toggleSavePost,getSavedPosts} from "../controllers/post.controller.js";

const router=express.Router();

router.use(protectRoute);

router.post("/",createPost);
router.get("/",getPosts);
router.get("/saved",getSavedPosts);
router.post("/:id/like",toggleLike);
router.post("/:id/save",toggleSavePost);

export default router;