import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from 'cors';
import { addDonation, getMonthlyDonations } from './src/lib/storage.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, 'dist')));

// API Routes
app.post('/api/donations', (req, res) => {
  try {
    const { name, amount } = req.body;
    addDonation(name, Number(amount));
    res.status(201).json({ message: 'Donation added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add donation' });
  }
});

app.get('/api/donations/monthly', (req, res) => {
  try {
    const monthlyDonations = getMonthlyDonations();
    res.json(monthlyDonations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch donations' });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});