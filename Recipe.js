import mongoose from "mongoose";

const RecipeSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: {
    data: Buffer,
    contentType: String,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

export default mongoose.model("Recipe", RecipeSchema);
