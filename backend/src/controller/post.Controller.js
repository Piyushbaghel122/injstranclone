import postModel from "../models/post.models.js";

async function createPostController(req, res){
     try {
          if (req.is("multipart/form-data")) {
               return res.status(415).json({
                    message: "Use raw JSON or x-www-form-urlencoded for this endpoint. File upload is not configured yet.",
                    requiredFields: ["imgUrl", "user"],
                    optionalFields: ["caption"],
               });
          }

          const { imgUrl, user } = req.body;
          const caption = req.body.caption ?? req.body.capation ?? "";

          if (!imgUrl || !user) {
               return res.status(400).json({
                    message: "imgUrl and user are required",
                    received: req.body,
               });
          }

          const post = await postModel.create({
               capation: caption,
               imgUrl,
               user,
          });

          return res.status(201).json({
               message: "Post created successfully",
               post,
          });
     } catch (error) {
          return res.status(500).json({
               message: error.message,
          });
     }
}

export default createPostController;
