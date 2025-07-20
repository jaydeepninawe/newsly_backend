const Article = require("../models/Article");
const cloudinary = require("cloudinary").v2;
const sanitizeHtml = require("sanitize-html");
const { body, validationResult } = require("express-validator");

// Utility: Sanitize user input before DB insert
function sanitizeInput(data) {
  return {
    title: sanitizeHtml(data.title, { allowedTags: [], allowedAttributes: {} }),
    slug: sanitizeHtml(data.slug, { allowedTags: [], allowedAttributes: {} }),
    section: sanitizeHtml(data.section, { allowedTags: [], allowedAttributes: {} }),
    published: data.published === "true" || data.published === true,
    excerpt: sanitizeHtml(data.excerpt || "", {
      allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
      allowedAttributes: {
        a: ['href', 'name', 'target'],
      },
    }),
    body: sanitizeHtml(data.body || "", {
      allowedTags: ['b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li', 'p', 'br', 'img', 'h1', 'h2', 'h3', 'blockquote'],
      allowedAttributes: {
        a: ['href', 'name', 'target'],
        img: ['src', 'alt', 'width', 'height'],
      },
    }),
  };
}

// GET all articles
exports.getall = async (req, res) => {
  try {
    const articles = await Article.find().sort({ publishedAt: -1 });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: "Error fetching articles" });
  }
};

// GET published articles by section
exports.getPublishedBySection = async (req, res) => {
  const section = req.params.section;
  try {
    const articles = await Article.find({ section, published: true }).sort({ publishedAt: -1 });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: "Error fetching articles" });
  }
};

// GET article by slug
exports.getBySlug = async (req, res) => {
  try {
    const article = await Article.findOne({
      slug: req.params.slug,
      published: true,
    });
    if (!article) return res.status(404).json({ message: "Article not found" });
    res.json(article);
  } catch (err) {
    res.status(500).json({ error: "Error fetching article" });
  }
};

// POST create article
exports.createArticle = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    let result = null;
    if (req.file) {
      result = await cloudinary.uploader.upload(req.file.path, { folder: "ngo-news" });
    }

    const cleanData = sanitizeInput(req.body);

    const article = new Article({
      ...cleanData,
      imageUrl: result?.secure_url || "",
      cloudinaryId: result?.public_id || "",
      publishedAt: cleanData.published ? new Date() : null,
    });

    await article.save();
    res.status(201).json(article);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// PUT update article
exports.updateArticle = async (req, res) => {
  try {
    const cleanData = sanitizeInput(req.body);
    const updated = await Article.findByIdAndUpdate(req.params.id, cleanData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Update failed" });
  }
};

// DELETE article
exports.deleteArticle = async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
};

// Validation middleware for article creation
exports.validateArticle = [
  body("title").notEmpty().trim().escape(),
  body("slug").notEmpty().trim().escape(),
  body("section").notEmpty().trim().escape(),
  body("body").notEmpty(), // DO NOT escape HTML
  body("excerpt").optional(),
  body("published").optional().isBoolean().toString(),
];
