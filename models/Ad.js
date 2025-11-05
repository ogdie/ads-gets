import mongoose from "mongoose";

const adSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
    required: true
  },
  platform: {
    type: String,
    enum: ['Facebook', 'Instagram', 'Google'],
    required: true
  },
  spent: {
    type: Number,
    required: true,
    default: 0
  },
  audience: {
    type: String,
    enum: ['frio', 'quente'],
    required: true
  },
  leads: {
    type: Number,
    default: 0
  },
  costPerLead: {
    type: Number,
    default: 0
  },
  costPerClick: {
    type: Number,
    default: 0
  },
  clicks: {
    type: Number,
    default: 0
  },
  impressions: {
    type: Number,
    default: 0
  },
  reach: {
    type: Number,
    default: 0
  },
  engagement: {
    type: Number,
    default: 0
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['ativo', 'pausado', 'finalizado'],
    default: 'ativo'
  },
  description: {
    type: String,
    default: ''
  },
  descriptionEn: {
    type: String,
    default: ''
  },
  targetAudience: {
    type: String,
    default: ''
  },
  budget: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Ad || mongoose.model("Ad", adSchema);

