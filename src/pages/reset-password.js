'use client';
import { useState } from 'react';
import axios from 'axios';
import { FaEnvelope } from 'react-icons/fa';
import Link from 'next/link';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await axios.post('http://127.0.0.1:8000/api/auth/password-reset/', { email }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
        timeout: 10000,
      });
      setMessage('✅ Reset email sent! Check your inbox.');
    } catch (error) {
      setMessage(
        error.response?.data?.error
          ? `❌ ${error.response.data.error}`
          : error.request
          ? '❌ Server not responding. Try again later.'
          : `❌ Error: ${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 p-4">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-2">Reset Password</h2>
        <p className="text-center text-gray-600 mb-6">Enter your email to receive a reset link</p>

        <form onSubmit={handleResetRequest} className="space-y-4">
          <div className="relative">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded bg-white text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          <button
            type="submit"
            className={`w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white py-2 rounded shadow-md transition duration-200 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                Sending...
              </div>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        {message && (
          <div
            className={`mt-4 p-3 text-center text-sm rounded ${
              message.startsWith('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {message}
          </div>
        )}

        <div className="mt-6 text-center">
          <Link href="/login" className="text-blue-600 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}