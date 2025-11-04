import express from "express";
import FAQ from "../models/FAQ.js";

const router = express.Router();

// Get frequent FAQs
router.get("/frequent", async (req, res) => {
  try {
    const { language = 'pt' } = req.query;
    const faqs = await FAQ.find({ isFrequent: true, language })
      .sort({ views: -1 })
      .limit(10);
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search FAQs
router.get("/search", async (req, res) => {
  try {
    const { q, language = 'pt' } = req.query;
    if (!q) {
      return res.status(400).json({ error: "Query parameter 'q' is required" });
    }

    const faqs = await FAQ.find({
      language,
      $or: [
        { question: { $regex: q, $options: "i" } },
        { answer: { $regex: q, $options: "i" } }
      ]
    })
      .sort({ views: -1 })
      .limit(20);
    
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all FAQs
router.get("/", async (req, res) => {
  try {
    const { language = 'pt', category } = req.query;
    const query = { language };
    if (category) {
      query.category = category;
    }
    const faqs = await FAQ.find(query).sort({ views: -1 });
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Increment FAQ views
router.put("/:id/views", async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!faq) {
      return res.status(404).json({ error: "FAQ não encontrada" });
    }
    res.json(faq);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

