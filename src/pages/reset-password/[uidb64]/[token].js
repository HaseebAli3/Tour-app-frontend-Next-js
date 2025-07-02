import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid'; // ✅ Added for Eye Icon

export default function ResetPasswordConfirm() {
  const router = useRouter();
  const { uidb64, token } = router.query;

  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // ✅ State for toggle
  const [message, setMessage] = useState('');
  const [tokenValid, setTokenValid] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkTokenValidity = async () => {
      if (uidb64 && token) {
        try {
          await axios.get(`http://127.0.0.1:8000/api/auth/password-reset-confirm/${uidb64}/${token}/`);
          setTokenValid(true);
        } catch (error) {
          setMessage('❌ Invalid or expired link.');
          setTokenValid(false);
        } finally {
          setLoading(false);
        }
      }
    };
    checkTokenValidity();
  }, [uidb64, token]);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/auth/password-reset-confirm/${uidb64}/${token}/`,
        { password: newPassword }
      );
      setMessage('✅ Password reset successful! You can now login.');
    } catch (error) {
      setMessage('❌ Failed to reset password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 p-4">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-2">Set New Password</h2>

        {loading ? (
          <p className="text-center text-gray-600">Checking reset link...</p>
        ) : tokenValid ? (
          <form onSubmit={handlePasswordReset} className="space-y-4">
            
            {/* ✅ Password Input with Eye Toggle */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter new password"
                className="w-full px-4 py-2 border border-gray-300 rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />

              <div
                className="absolute inset-y-0 right-2 flex items-center cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-600" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-600" />
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white py-2 rounded shadow-md transition duration-200"
            >
              Reset Password
            </button>
          </form>
        ) : (
          <div className="text-center text-red-600">{message}</div>
        )}

        {message && tokenValid && (
          <div
            className={`mt-4 p-3 text-center text-sm rounded ${
              message.includes('Failed') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}
          >
            {message}
          </div>
        )}

        <div className="mt-6 text-center">
          <Link href="/login">
            <button className="text-blue-600 hover:underline">Back to Login</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
