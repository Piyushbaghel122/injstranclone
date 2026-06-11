import postModel from "../models/post.models.js";
  import ImageKit from "@imagekit/nodejs";
import jwt from "jsonwebtoken";

const client = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

function getTokenFromRequest(req) {
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  return req.cookies.token || bearerToken;
}

export async function createPostController(req, res) {
  try {
    const token = getTokenFromRequest(req);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const fileData = req.file.buffer.toString("base64");
    const response = await client.files.upload({
      file: fileData,
      fileName: req.file.originalname,
    });

    const post = await postModel.create({
      caption: req.body.caption || "",
      imgUrl: response.url,
      user: decoded.id,
    });

    return res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function getPostController(req, res) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const posts = await postModel
      .find({ user: userId })
      .populate("user", "name email phone country");

    return res.status(200).json({
      message: "Posts fetched successfully",
      user: {
        id: decoded.id,
        email: decoded.email,
        phone: decoded.phone,
      },
      posts,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch posts",
      error: error.message,
    });
  }
}

export async function getPostDetailsController(req, res) {
  const token = getTokenFromRequest(req);
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }

  const userId = decoded.id;
  const postId = req.params.postId;

  try {
    const post = await postModel
      .findById(postId)
      .populate("user", "name email phone country");

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const isValidUser = post.user._id.toString() === userId;
    if (!isValidUser) {
      return res.status(403).json({
        message: "forbidden content",
      });
    }

    return res.status(200).json({
      message: "Post fetched successfully",
      post,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch post details",
      error: error.message,
    });
  }
}

export async function getFeedController(req, res){
  try {
    const posts = await postModel.find().populate("user", "name email phone country").select("-user.password ");

    return res.status(200).json({
      message: "posts fetched successfully",
      posts,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch feed",
      error: error.message,
    });
  }
}


