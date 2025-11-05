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

    await Ad.deleteMany({});
    console.log("Anúncios anteriores removidos");

    const adsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../data/sample-ads.json"), "utf8")
    );

    const faqsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../data/sample-faqs.json"), "utf8")
    );

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

    const targetYear = 2025;
    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; 
    const today2025 = new Date(targetYear, 10, 5); 
    today2025.setHours(0, 0, 0, 0);

    const remainingMonths = [...months];    
    const distributionMonths = [];
    for (let i = 0; i < 15; i++) {
      const monthIndex = i % remainingMonths.length;
      distributionMonths.push(remainingMonths[monthIndex]);
    }
    distributionMonths.sort(() => Math.random() - 0.5);

    const adsWithUserId = adsData.map((ad, index) => {
      let startDate;
      
      if (index < 5) {        
        startDate = today2025;
      } else {
        const assignedMonth = distributionMonths[index - 5];
        const daysInMonth = new Date(targetYear, assignedMonth, 0).getDate();
        const randomDay = Math.floor(Math.random() * daysInMonth) + 1;
        startDate = new Date(targetYear, assignedMonth - 1, randomDay);
        startDate.setHours(0, 0, 0, 0);
      }
      
      return {
        ...ad,
        userId: testUser._id,
        startDate: startDate,
        endDate: ad.endDate ? new Date(ad.endDate) : null
      };
    });

    const createdAds = await Ad.insertMany(adsWithUserId);
    console.log(`${createdAds.length} anúncios criados`);
    console.log(`- 5 anúncios para hoje em 2025 (${today2025.toLocaleDateString('pt-BR')})`);
    console.log(`- 15 anúncios distribuídos entre janeiro e outubro de 2025`);
    
    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                       'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const distribution = {};
    createdAds.forEach(ad => {
      const month = new Date(ad.startDate).getMonth() + 1;
      const monthName = monthNames[month - 1];
      distribution[monthName] = (distribution[monthName] || 0) + 1;
    });
    console.log('\nDistribuição por mês:');
    Object.entries(distribution).forEach(([month, count]) => {
      console.log(`  ${month}: ${count} anúncios`);
    });

    await FAQ.deleteMany({});
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