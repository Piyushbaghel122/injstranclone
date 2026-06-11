import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    caption:{
        type: String,
        default: ""
  },
     imgUrl: {
        type: String, 
        required: [true , "img url is required for creating an post"]
     },
     user: {
        ref: "User",
        type:mongoose.Schema.Types.ObjectId, 
        required: [ true , "user is is required for creating db"]
     }
});

const postModel = mongoose.model("posts" , postSchema);

export default postModel;
