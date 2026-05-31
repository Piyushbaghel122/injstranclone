import express from "express";
import createPostController from "../controller/post.Controller.js";

const postRouter = express.Router();

postRouter.post("/", createPostController);

export default postRouter;
