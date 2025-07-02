'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/auth/login/', {
        email,
        password,
      });

      const { access, refresh } = response.data;
      Cookies.set('accessToken', access, { expires: 7 });
      Cookies.set('refreshToken', refresh, { expires: 7 });

      setMessage('✅ Login successful! Redirecting...');
      router.push('/locations');
    } catch (error) {
      console.error('Login error:', error);
      setMessage('❌ Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 p-4">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-2">Login to Nomadic Travel 🌿</h2>
        <p className="text-center text-gray-600 mb-6">Welcome back! Start your adventure again!</p>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email Field with Icon */}
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

          {/* Password Field with Icon and Eye */}
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

            {/* Toggle Show/Hide Password */}
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
            {loading ? 'Logging in...' : 'Login'}
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
            {message}
          </div>
        )}

        {/* Forgot Password */}
        <div className="mt-4 text-center">
          <Link href="/reset-password">
            <button className="text-blue-600 hover:underline text-sm">
              Forgot Password?
            </button>
          </Link>
        </div>

        {/* Register Link */}
        <div className="mt-2 text-center">
          <Link href="/register">
            <button className="text-green-700 hover:underline text-sm">
              Don&apos;t have an account? Register here
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
