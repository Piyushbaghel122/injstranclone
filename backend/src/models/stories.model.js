import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const storyModel =
  mongoose.models.Story || mongoose.model("Story", storySchema);

export default storyModel;
