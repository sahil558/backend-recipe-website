import express from "express";
import multer from "multer";
import Recipe from "../models/Recipe.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware for authentication
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract from "Bearer token"
  if (!token) return res.status(401).json({ error: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
};

// Multer setup for image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Get all recipes
router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find().populate("user", "username");
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: "Error fetching recipes" });
  }
});

// Add a recipe (authenticated & with image upload)
router.post("/", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required" });
    }

    const newRecipe = new Recipe({
      title,
      description,
      image: req.file ? { data: req.file.buffer, contentType: req.file.mimetype } : null,
      user: req.user,
    });

    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (err) {
    res.status(500).json({ error: "Error saving recipe" });
  }
});

export default router;
