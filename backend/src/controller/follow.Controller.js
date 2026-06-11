import followModel from "../models/follow.model.js";
import authModel from "../models/auth.models.js";

export async function followUserController(req, res) {
  try {
    const follower = req.user?.id;
    const followeeIdentifier = req.params.username;

    if (!follower || !followeeIdentifier) {
      return res.status(400).json({
        message: "Follower and followee are required",
      });
    }

    const followeeUser = await authModel.findOne({
      $or: [
        { username: followeeIdentifier },
        { name: followeeIdentifier },
        { email: followeeIdentifier },
      ],
    });

    if (!followeeUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (follower === followeeUser._id.toString()) {
      return res.status(400).json({
        message: "You cannot follow yourself",
      });
    }

    const followee = followeeUser._id;
    const isUserFollowing = await followModel.findOne({
      follower,
      followee,
    });

    if (isUserFollowing) {
      return res.status(409).json({
        message: "You already follow this user",
      });
    }

    const follow = await followModel.create({
      follower,
      followee,
    });

    return res.status(201).json({
      message: "User followed successfully",
      follow,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to follow user",
      error: error.message,
    });
  }
}

async function unfollowUserController(req , res){
  const follower = req.user.id
  const followee = req.params.username

  const isUserFollowing = await followModel.findOne({
    follower,
    followee,
  })

  if(!isUserFollowing){
    return res.status(200).json({
      message: `You are not following ${followee}`
    })
  }

  await followModel.findByIdAndDelete(isUserFollowing._id)

  return res.status(200).json({
    message: `You have unfollowed ${followee}`
  })
}


export { unfollowUserController };

