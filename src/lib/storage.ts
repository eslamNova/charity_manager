export interface Donation {
  id: string;
  name: string;
  amount: number;
  createdAt: string;
}

const STORAGE_KEY = 'donations';

export const addDonation = (name: string, amount: number): void => {
  const donations = getDonations();
  const newDonation: Donation = {
    id: crypto.randomUUID(),
    name,
    amount,
    createdAt: new Date().toISOString(),
  };
  donations.push(newDonation);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(donations));
};

export const getDonations = (): Donation[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const getMonthlyDonations = () => {
  const donations = getDonations();
  const monthlyData = new Map<string, { donation_count: number; total_amount: number }>();

  donations.forEach(donation => {
    const month = donation.createdAt.substring(0, 7); // YYYY-MM format
    const current = monthlyData.get(month) || { donation_count: 0, total_amount: 0 };
    monthlyData.set(month, {
      donation_count: current.donation_count + 1,
      total_amount: current.total_amount + donation.amount,
    });
  });

  return Array.from(monthlyData.entries())
    .map(([month, data]) => ({
      month,
      donation_count: data.donation_count,
      total_amount: data.total_amount,
    }))
    .sort((a, b) => b.month.localeCompare(a.month));
};