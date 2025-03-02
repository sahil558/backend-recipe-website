import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import recipeRoutes from "./routes/recipes.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use("/auth", authRoutes);
app.use("/recipes", recipeRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => {
  console.error("❌ MongoDB Connection Error:", err);
  process.exit(1);  // Exit if MongoDB connection fails
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
