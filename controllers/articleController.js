const Article = require("../models/Article");
const cloudinary = require("cloudinary").v2;


exports.getall = async (req, res) => {
  try {
    const articles = await Article.find().sort({ publishedAt: -1 });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: "Error fetching articles" });
  }
};
// Get all articles by section
exports.getPublishedBySection = async (req, res) => {
  const section = req.params.section;

  try {
    const articles = await Article.find({
      section,
      published: true,
    }).sort({ publishedAt: -1 });

    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: "Error fetching articles" });
  }
};

// Get single article by slug and section
exports.getBySlug = async (req, res) => {
  try {
    const article = await Article.findOne({
      slug: req.params.slug,
      published: true,
    });
    res.json(article);
    console.log("article");
    console.log("Requested slug:", req.params.slug);
    if (!article) return res.status(404).json({ message: "Article not found" });
    
  } catch (err) {
    res.status(500).json({ error: "Error fetching article" });
  }
};

// Create new article in section
exports.createArticle = async (req, res) => {
  try {
    let result = null;
    if (req.file) {
      result = await cloudinary.uploader.upload(req.file.path, {
        folder: "ngo-news",
      });
    }

    const article = new Article({
      ...req.body,
      imageUrl: result?.secure_url || "",
      cloudinaryId: result?.public_id || "",
      publishedAt: req.body.published === "true" ? new Date() : null,
    });

    await article.save();
    res.status(201).json(article);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update article
exports.updateArticle = async (req, res) => {
  try {
    const updated = await Article.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Update failed" });
  }
};

// Delete article
exports.deleteArticle = async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
};
