'use client';

import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { FaEnvelope, FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Register() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/auth/signup/', {
        email,
        full_name: fullName,
        password,
      });

      if (response && response.data) {
        setMessage('✅ Registration successful! You can now login.');
        setEmail('');
        setFullName('');
        setPassword('');
      } else {
        setMessage('❌ Registration failed. Empty response from server.');
      }

    } catch (error) {
      console.error('Registration Error:', error);

      if (error.response) {
        const errorData = error.response.data;
        if (errorData.detail) {
          setMessage(`❌ ${errorData.detail}`);
        } else if (typeof errorData === 'object') {
          const fieldErrors = Object.entries(errorData)
            .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
            .join(' | ');
          setMessage(`❌ ${fieldErrors}`);
        } else {
          setMessage('❌ Registration failed due to unknown error.');
        }
      } else if (error.request) {
        setMessage('❌ Server not responding. Try again later.');
      } else {
        setMessage('❌ Something went wrong. Please check your internet.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 p-4">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-2">Create Your Nomadic Travel Account 🌿</h2>
        <p className="text-center text-gray-600 mb-6">Start your next adventure today!</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {/* Full Name Field */}
          <div className="relative">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {/* Password Field */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="w-full px-4 py-2 pl-10 pr-10 border border-gray-300 rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white py-2 rounded shadow-md transition duration-200 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        {/* Message Box */}
        {message && (
          <div
            className={`mt-4 p-3 text-center text-sm rounded ${
              message.startsWith('✅')
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {loading ? 'Please wait...' : message}
          </div>
        )}

        {/* Login Link */}
        <div className="mt-6 text-center">
          <Link href="/login">
            <button className="text-green-700 hover:underline">
              Already have an account? Login here
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
