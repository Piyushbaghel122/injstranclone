import express from "express";
import  { createPostController , getFeedController, getPostController, getPostDetailsController} from "../controller/post.Controller.js";
import multer from "multer";
import { identifyUser } from "../middleware/autth.middleware.js";

const upload = multer({ storage: multer.memoryStorage() });

const postRouter = express.Router();

postRouter.use(identifyUser);

postRouter.post("/", upload.single("piyush"), createPostController);
postRouter.get("/" , getPostController);
postRouter.get("/feed" , getFeedController);
postRouter.get("/details/:postId" , getPostDetailsController )
postRouter.get("/:postId" , getPostDetailsController )

export default postRouter;
