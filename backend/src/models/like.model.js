import mongoose from "mongoose";

const likeaSchema = new mongoose.Schema({
    posts: {
      type: mongoose.Schema.Types.ObhjectId,
      ref: "posts",
      required: true
    },
    user: {
        type: String,
        required: [ true, "User is requird "],
    }
}, {
    timestamps: true
})

likeSchema.index({posts: 1, user: 1} , { unique: true })

const likeModel = mongoose.model("likes" , likeSchema);

export default likeModel;