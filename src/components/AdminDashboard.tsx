import React, { useEffect, useState } from 'react';
import { Building2, DollarSign, Users, Clock } from 'lucide-react';

interface MonthlyDonation {
  month: string;
  donation_count: number;
  total_amount: number;
}

interface Donation {
  id: number;
  name: string;
  amount: number;
  created_at: string;
}

export default function AdminDashboard() {
  const [donations, setDonations] = useState<MonthlyDonation[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalDonors, setTotalDonors] = useState(0);
  const [lastDonation, setLastDonation] = useState<Donation | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        setError('');
      } else {
        setError('Invalid password');
      }
    } catch (error) {
      setError('Failed to authenticate');
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = async () => {
      try {
        const [monthlyResponse, lastDonationResponse] = await Promise.all([
          fetch('/api/donations/monthly'),
          fetch('/api/donations/last')
        ]);

        const monthlyData = await monthlyResponse.json();
        const lastDonationData = await lastDonationResponse.json();
        
        setDonations(monthlyData);
        setLastDonation(lastDonationData);
        
        const total = monthlyData.reduce((sum: number, item: MonthlyDonation) => sum + item.total_amount, 0);
        const donors = monthlyData.reduce((sum: number, item: MonthlyDonation) => sum + item.donation_count, 0);
        
        setTotalAmount(total);
        setTotalDonors(donors);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-islamic-50 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <Building2 className="w-12 h-12 mx-auto text-islamic-600" />
            <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
              إدراة المجموعة
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="password" className="sr-only">
                رمز الدخول
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-islamic-500 focus:border-islamic-500 focus:z-10 sm:text-sm"
                placeholder="Admin Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && (
              <div className="text-sm text-center text-red-600">
                {error}
              </div>
            )}
            <div>
              <button
                type="submit"
                className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md group bg-islamic-600 hover:bg-islamic-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-islamic-500"
              >
                دخول
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-12 bg-islamic-50 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">صفحة الإدارة</h1>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-4 py-2 text-sm font-medium text-islamic-600 hover:text-islamic-700"
          >
            خروج
          </button>
        </div>
        
        <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="overflow-hidden bg-white rounded-lg shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="w-6 h-6 text-islamic-600" />
                </div>
                <div className="flex-1 w-0 ml-5">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      إجمالي المبلغ
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      ${totalAmount.toFixed(2)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden bg-white rounded-lg shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="w-6 h-6 text-islamic-600" />
                </div>
                <div className="flex-1 w-0 ml-5">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      عدد المسجلين
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {totalDonors}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden bg-white rounded-lg shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="w-6 h-6 text-islamic-600" />
                </div>
                <div className="flex-1 w-0 ml-5">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      آخر عملية
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {lastDonation ? (
                        <>
                          ${lastDonation.amount.toFixed(2)} by {lastDonation.name}
                        </>
                      ) : 'No donations yet'}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="mb-4 text-lg font-medium leading-6 text-gray-900">
              سجلات شهرية
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-islamic-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      الشهر
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      عدد المسجلين
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      إجمالي المبلغ
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {donations.map((donation) => (
                    <tr key={donation.month}>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {new Date(donation.month + '-01').toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long'
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {donation.donation_count}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                        ${donation.total_amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}