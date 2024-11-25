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
    if (code !== '1124') {
      setError('كود المجموعة خاطئ، الرجاء العودة لجروب الواتس آب للتأكد من الكود');
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
        throw new Error('حدث خطأ الرجاء تنبيه الشيخ محمد على الواتس آب');
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
      setError('حدث خطًا الرجاء المحاولة مرة أخرى');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-screen bg-islamic-50"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="mb-8"
          >
            <Check className="w-32 h-32 mx-auto text-islamic-600" />
          </motion.div>
          <h2 className="mb-4 text-3xl font-bold text-islamic-800">
            تم التسجيل بنجاح
          </h2>
          <p className="text-islamic-600"> جزاكم الله خيرًا</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-12 bg-gradient-to-br from-islamic-50 to-islamic-100 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto overflow-hidden bg-white shadow-lg rounded-xl">
        <div className="px-8 py-12">
          <div className="flex items-center justify-center mb-8">
            <Building2 className="w-12 h-12 text-islamic-600" />
          </div>
          <h2 className="mb-8 text-3xl font-extrabold text-center text-gray-900">
            قم بتسجيل قيمة التبرع
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6 text-right">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                كود المجموعة
              </label>
              <input
                type="text"
                id="code"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-islamic-500 focus:ring-islamic-500"
                placeholder="أدخل الكود الموجود على جروب الواتس آب"
              />
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                الاسم
              </label>
              <input
                type="text"
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-islamic-500 focus:ring-islamic-500"
                placeholder="اختياري يمكنك كتابة أي حرف"
              />
            </div>
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                القيمة
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
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
                  className="block w-full pr-12 border-gray-300 rounded-md pl-7 focus:border-islamic-500 focus:ring-islamic-500"
                  placeholder="0.00"
                />
              </div>
            </div>
            {error && (
              <div className="text-sm text-center text-red-600">
                {error}
              </div>
            )}
            <div>
              <button
                type="submit"
                className="flex justify-center w-full px-4 py-3 text-sm font-medium text-white transition-colors border border-transparent rounded-md shadow-sm bg-islamic-600 hover:bg-islamic-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-islamic-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'جاري المعالجة' : 'التسجيل'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        className="relative max-w-md p-6 mx-auto mt-20 bg-white rounded-lg"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      >
        <h3 className="mb-4 text-lg font-medium text-gray-900">تأكيد القيمة - يرجى التأكد من الرقم</h3>
        <div className="space-y-4 text-right">
          <p className="text-sm text-right text-gray-600">
            اسم: <span className="font-medium">{name}</span>
          </p>
          <p className="text-sm text-right text-gray-600">
            قيمة: <span className="font-medium">${Number(amount).toFixed(2)}</span>
          </p>
          <div className="flex space-x-4">
          <button
              onClick={() => setShowModal(false)}
              className="flex-1 px-4 py-2 text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              الغاء
            </button>
            
            <button
              onClick={confirmDonation}
              className="flex-1 px-4 py-2 text-white rounded-md bg-islamic-600 hover:bg-islamic-700"
            >
              تأكيد
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}