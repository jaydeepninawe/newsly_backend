const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/articleController");
const { login } = require("../controllers/login");

const upload = require("../middleware/upload");
const verifyAdmin = require("../middleware/verifyAdmin");

router.get("/", ctrl.getall);
router.get("/section/:section", ctrl.getPublishedBySection);
router.get("/:slug", ctrl.getBySlug);
router.post("/login", login);
router.post("/", verifyAdmin, upload.single("image"), ctrl.createArticle);
router.put("/:id", verifyAdmin, ctrl.updateArticle);
router.delete("/:id", verifyAdmin, ctrl.deleteArticle);

module.exports = router;
