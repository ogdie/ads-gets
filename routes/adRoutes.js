import express from "express";
import jwt from "jsonwebtoken";
import Ad from "../models/Ad.js";

const router = express.Router();

// Middleware de autenticação
const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ error: "Token não fornecido" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido" });
  }
};

// Get all ads
router.get("/", authenticate, async (req, res) => {
  try {
    const { platform, startDate, endDate, year, month, day } = req.query;
    const query = { userId: req.userId };

    if (platform) {
      query.platform = platform;
    }

    if (year || month || day) {
      query.startDate = {};
      if (year) {
        query.startDate.$gte = new Date(`${year}-01-01`);
        query.startDate.$lt = new Date(`${parseInt(year) + 1}-01-01`);
      }
      if (month) {
        const yearForMonth = year || new Date().getFullYear();
        query.startDate.$gte = new Date(`${yearForMonth}-${month}-01`);
        const nextMonth = parseInt(month) + 1;
        query.startDate.$lt = new Date(`${yearForMonth}-${nextMonth}-01`);
      }
      if (day) {
        const yearForDay = year || new Date().getFullYear();
        const monthForDay = month || new Date().getMonth() + 1;
        query.startDate.$gte = new Date(`${yearForDay}-${monthForDay}-${day}`);
        query.startDate.$lt = new Date(`${yearForDay}-${monthForDay}-${parseInt(day) + 1}`);
      }
    }

    if (startDate && endDate) {
      query.startDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const ads = await Ad.find(query).sort({ createdAt: -1 });
    res.json(ads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single ad
router.get("/:id", authenticate, async (req, res) => {
  try {
    const ad = await Ad.findOne({ _id: req.params.id, userId: req.userId });
    if (!ad) {
      return res.status(404).json({ error: "Anúncio não encontrado" });
    }
    res.json(ad);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create ad
router.post("/", authenticate, async (req, res) => {
  try {
    const adData = {
      ...req.body,
      userId: req.userId
    };
    const ad = await Ad.create(adData);
    res.status(201).json(ad);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update ad
router.put("/:id", authenticate, async (req, res) => {
  try {
    const ad = await Ad.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    if (!ad) {
      return res.status(404).json({ error: "Anúncio não encontrado" });
    }
    res.json(ad);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete ad
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const ad = await Ad.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!ad) {
      return res.status(404).json({ error: "Anúncio não encontrado" });
    }
    res.json({ message: "Anúncio removido com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Duplicate ad
router.post("/:id/duplicate", authenticate, async (req, res) => {
  try {
    const originalAd = await Ad.findOne({ _id: req.params.id, userId: req.userId });
    if (!originalAd) {
      return res.status(404).json({ error: "Anúncio não encontrado" });
    }

    const adData = originalAd.toObject();
    delete adData._id;
    delete adData.createdAt;
    adData.title = `${adData.title} (Cópia)`;

    const newAd = await Ad.create(adData);
    res.status(201).json(newAd);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get dashboard stats
router.get("/stats/dashboard", authenticate, async (req, res) => {
  try {
    const ads = await Ad.find({ userId: req.userId });
    
    const totalSpent = ads.reduce((sum, ad) => sum + ad.spent, 0);
    
    const platformStats = {
      Facebook: { spent: 0, leads: 0, clicks: 0 },
      Instagram: { spent: 0, leads: 0, clicks: 0 },
      Google: { spent: 0, leads: 0, clicks: 0 }
    };

    ads.forEach(ad => {
      if (platformStats[ad.platform]) {
        platformStats[ad.platform].spent += ad.spent;
        platformStats[ad.platform].leads += ad.leads;
        platformStats[ad.platform].clicks += ad.clicks;
      }
    });

    // Today's balance
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayAds = ads.filter(ad => {
      const adDate = new Date(ad.startDate);
      return adDate >= today;
    });
    const todaySpent = todayAds.reduce((sum, ad) => sum + ad.spent, 0);

    res.json({
      totalSpent,
      todaySpent,
      platformStats,
      totalAds: ads.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

