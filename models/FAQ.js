import mongoose from "mongoose";

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['geral', 'anuncios', 'plataformas', 'pagamentos', 'tecnico'],
    default: 'geral'
  },
  language: {
    type: String,
    enum: ['pt', 'en'],
    default: 'pt'
  },
  isFrequent: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.FAQ || mongoose.model("FAQ", faqSchema);

