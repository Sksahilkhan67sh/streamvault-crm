require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("../models/Admin.model");
const Lead = require("../models/Lead.model");

const seedData = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to MongoDB");

  // Clear existing data
  await Admin.deleteMany({});
  await Lead.deleteMany({});
  console.log("🧹 Cleared existing data");

  // Create admin
  const admin = await Admin.create({
    name: process.env.ADMIN_NAME || "Admin User",
    email: process.env.ADMIN_EMAIL || "admin@streamvault.io",
    password: process.env.ADMIN_PASSWORD || "admin123",
    role: "super_admin",
  });
  console.log(`👤 Admin created: ${admin.email}`);

  // Seed leads
  const leads = [
    { name: "Rohan Mehta", email: "rohan@techsol.in", phone: "+91 98765 43210", company: "TechSol India", source: "LinkedIn", message: "Interested in enterprise plan with custom integrations.", status: "contacted", followUpDate: new Date(Date.now() + 2 * 86400000) },
    { name: "Priya Sharma", email: "priya@nexusdigital.com", phone: "+91 87654 32109", company: "Nexus Digital", source: "Website", message: "Looking for streaming solution for online academy with 50k+ students.", status: "new" },
    { name: "Arjun Kapoor", email: "arjun@growthbase.io", phone: "+91 76543 21098", company: "GrowthBase", source: "Referral", message: "Startup looking for RTMP streaming at scale. Referred by Rohan.", status: "converted" },
    { name: "Meera Nair", email: "meera@cloudbridge.in", phone: "+91 65432 10987", company: "CloudBridge", source: "Event", message: "Met at NASSCOM. Very interested. Follow up urgently.", status: "new", followUpDate: new Date(Date.now() + 86400000) },
    { name: "Siddharth Rao", email: "sid@pixelcraft.co", phone: "+91 54321 09876", company: "PixelCraft", source: "Social Media", message: "Asked about pricing for professional tier. Small team of 8.", status: "contacted" },
    { name: "Anjali Desai", email: "anjali@finedge.in", phone: "+91 43210 98765", company: "FinEdge", source: "Cold Email", message: "Responded positively to cold email. Wants a demo.", status: "new", followUpDate: new Date(Date.now() + 3 * 86400000) },
  ];

  await Lead.insertMany(leads);
  console.log(`✅ ${leads.length} leads seeded`);

  console.log("\n🎉 Seed complete!");
  console.log("────────────────────────────");
  console.log(`  Admin:    ${admin.email}`);
  console.log(`  Password: ${process.env.ADMIN_PASSWORD || "admin123"}`);
  console.log("────────────────────────────");
  process.exit(0);
};

seedData().catch((err) => {
  console.error("❌ Seed error:", err);
  process.exit(1);
});
