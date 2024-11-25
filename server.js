const express = require("express");
const path = require("path");
const cors = require("cors");
const Database = require("better-sqlite3");

const app = express();
const PORT = process.env.PORT || 3000;
const db = new Database("donations.db");

// Admin password - in production, use environment variables
const ADMIN_PASSWORD = "الحمدلله";

// Create tables if they don't exist
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS donations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`
).run();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "dist")));

// Admin authentication
app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ error: "Invalid password" });
  }
});

// API Routes
app.post("/api/donations", (req, res) => {
  try {
    const { name, amount } = req.body;
    const stmt = db.prepare(
      "INSERT INTO donations (name, amount) VALUES (?, ?)"
    );
    stmt.run(name, Number(amount));
    res.status(201).json({ message: "Donation added successfully" });
  } catch (error) {
    console.error("Error adding donation:", error);
    res.status(500).json({ error: "Failed to add donation" });
  }
});

app.get("/api/donations/monthly", (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT 
        strftime('%Y-%m', created_at) as month,
        COUNT(*) as donation_count,
        SUM(amount) as total_amount
      FROM donations
      GROUP BY strftime('%Y-%m', created_at)
      ORDER BY month DESC
    `);
    const monthlyDonations = stmt.all();
    res.json(monthlyDonations);
  } catch (error) {
    console.error("Error fetching donations:", error);
    res.status(500).json({ error: "Failed to fetch donations" });
  }
});

app.get("/api/donations/last", (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT id, name, amount, created_at
      FROM donations
      ORDER BY created_at DESC
      LIMIT 1
    `);
    const lastDonation = stmt.get();
    res.json(lastDonation || null);
  } catch (error) {
    console.error("Error fetching last donation:", error);
    res.status(500).json({ error: "Failed to fetch last donation" });
  }
});

// Serve React app for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
