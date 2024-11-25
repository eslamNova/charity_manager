import React, { useState } from 'react';
import { Building2, Check } from 'lucide-react';
import Modal from 'react-modal';
import { motion, AnimatePresence } from 'framer-motion';

Modal.setAppElement('#root');

export default function DonationForm() {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate donation code (example: "CHARITY2024")
    if (code !== 'CHARITY2024') {
      setError('Invalid donation code. Please contact the administrator.');
      return;
    }

    setIsSubmitting(true);
    setShowModal(true);
  };

  const confirmDonation = async () => {
    try {
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, amount: Number(amount) }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit donation');
      }

      setShowModal(false);
      setShowSuccess(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
        setName('');
        setAmount('');
        setCode('');
      }, 3000);
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-islamic-50 flex items-center justify-center"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="mb-8"
          >
            <Check className="h-32 w-32 text-islamic-600 mx-auto" />
          </motion.div>
          <h2 className="text-3xl font-bold text-islamic-800 mb-4">
            Donation Successful!
          </h2>
          <p className="text-islamic-600">Thank you for your generous contribution</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-islamic-50 to-islamic-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-8 py-12">
          <div className="flex items-center justify-center mb-8">
            <Building2 className="h-12 w-12 text-islamic-600" />
          </div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-8">
            Make a Blessed Contribution
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                Donation Code
              </label>
              <input
                type="text"
                id="code"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-islamic-500 focus:ring-islamic-500"
                placeholder="Enter your donation code"
              />
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-islamic-500 focus:ring-islamic-500"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Donation Amount
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="amount"
                  required
                  min="1"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="block w-full pl-7 pr-12 rounded-md border-gray-300 focus:border-islamic-500 focus:ring-islamic-500"
                  placeholder="0.00"
                />
              </div>
            </div>
            {error && (
              <div className="text-red-600 text-sm text-center">
                {error}
              </div>
            )}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-islamic-600 hover:bg-islamic-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-islamic-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Donate Now'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        className="relative bg-white rounded-lg max-w-md mx-auto mt-20 p-6"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      >
        <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Your Donation</h3>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Name: <span className="font-medium">{name}</span>
          </p>
          <p className="text-sm text-gray-600">
            Amount: <span className="font-medium">${Number(amount).toFixed(2)}</span>
          </p>
          <div className="flex space-x-4">
            <button
              onClick={confirmDonation}
              className="flex-1 py-2 px-4 bg-islamic-600 text-white rounded-md hover:bg-islamic-700"
            >
              Confirm
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}