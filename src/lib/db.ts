import Database from 'better-sqlite3';

const db = new Database(':memory:');

// Create tables if they don't exist
db.prepare(`
  CREATE TABLE IF NOT EXISTS donations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`).run();

export const addDonation = (name: string, amount: number) => {
  const stmt = db.prepare('INSERT INTO donations (name, amount) VALUES (?, ?)');
  return stmt.run(name, amount);
};

export const getMonthlyDonations = () => {
  const stmt = db.prepare(`
    SELECT 
      strftime('%Y-%m', created_at) as month,
      COUNT(*) as donation_count,
      SUM(amount) as total_amount
    FROM donations
    GROUP BY strftime('%Y-%m', created_at)
    ORDER BY month DESC
  `);
  return stmt.all();
};

export type MonthlyDonation = {
  month: string;
  donation_count: number;
  total_amount: number;
};