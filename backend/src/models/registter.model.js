import mongoose from "mongoose";

const registerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const registerModel =
  mongoose.models.Register || mongoose.model("Register", registerSchema);

export default registerModel;
