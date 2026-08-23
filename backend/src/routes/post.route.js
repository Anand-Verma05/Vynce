import express from "express";

import {protectRoute} from "../middleware/auth.middleware.js";
import {createPost,getPosts} from "../controllers/post.controller.js";

const router=express.Router();

router.use(protectRoute);

router.post("/",createPost);
router.get("/",getPosts);

export default router;