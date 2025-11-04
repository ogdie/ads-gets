import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { connectDB } from "../lib/mongodb.js";
import Ad from "../models/Ad.js";
import FAQ from "../models/FAQ.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seedData() {
  try {
    await connectDB();

    // Limpar dados existentes (opcional - remover em produção)
    // await Ad.deleteMany({});
    // await FAQ.deleteMany({});

    // Carregar dados de anúncios
    const adsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../data/sample-ads.json"), "utf8")
    );

    // Carregar dados de FAQs
    const faqsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../data/sample-faqs.json"), "utf8")
    );

    // Criar um usuário de teste se não existir
    const User = (await import("../models/User.js")).default;
    let testUser = await User.findOne({ email: "admin@techhr.com" });

    if (!testUser) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      testUser = await User.create({
        email: "admin@techhr.com",
        name: "Tech HR Admin",
        password: hashedPassword,
        language: "pt"
      });
      console.log("Usuário de teste criado:", testUser.email);
      console.log("Senha padrão: admin123");
    }

    // Adicionar userId aos anúncios e criar
    const adsWithUserId = adsData.map(ad => ({
      ...ad,
      userId: testUser._id,
      startDate: new Date(ad.startDate),
      endDate: ad.endDate ? new Date(ad.endDate) : null
    }));

    const createdAds = await Ad.insertMany(adsWithUserId);
    console.log(`${createdAds.length} anúncios criados`);

    // Criar FAQs
    const createdFAQs = await FAQ.insertMany(faqsData);
    console.log(`${createdFAQs.length} FAQs criadas`);

    console.log("Dados seedados com sucesso!");
    process.exit(0);
  } catch (error) {
    console.error("Erro ao seedar dados:", error);
    process.exit(1);
  }
}

seedData();

