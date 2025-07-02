'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Header from '@/components/Header';
import Image from 'next/image';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchBookings = async () => {
    try {
      const token = Cookies.get('accessToken');
      const res = await axios.get('http://127.0.0.1:8000/api/bookings/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('❌ Failed to load bookings. Please login or try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    try {
      const token = Cookies.get('accessToken');
      await axios.delete(`http://127.0.0.1:8000/api/bookings/${bookingId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('✅ Booking cancelled successfully.');
      fetchBookings();
    } catch (error) {
      console.error('Cancel Booking Error:', error);
      setMessage('❌ Failed to cancel booking. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-green-700 text-lg font-semibold">
        Loading your bookings...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-lg font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 pb-8">
      {/* Fixed Header */}
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      {/* Page Title */}
      <h1 className="text-4xl font-bold text-center text-green-800 my-8">
        📝 My Bookings
      </h1>

      {/* Flash Message */}
      {message && (
        <p
          className={`text-center mb-4 font-medium ${
            message.startsWith('✅') ? 'text-green-700' : 'text-red-700'
          }`}
        >
          {message}
        </p>
      )}

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <p className="text-center text-lg text-gray-700">You have no bookings yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-10">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white p-5 rounded-xl shadow-md relative overflow-hidden"
            >
              {/* Location Name */}
              <h2 className="text-2xl font-bold text-green-700 mb-2">
                {booking.location.name}
              </h2>

              {/* Location Description */}
              <p className="text-gray-700 mb-2">
                {booking.location.description.substring(0, 100)}...
              </p>

              {/* Price */}
              <p className="text-green-600 font-semibold mb-1">💰 Price: ${booking.location.price}</p>

              {/* Booking Date */}
              <p className="text-gray-600 mb-3">📅 Booking Date: {booking.booking_date}</p>

              {/* Location Image */}
              {booking.location.images.length > 0 && (
                <Image
                  src={`http://127.0.0.1:8000${booking.location.images[0]}`}
                  alt={booking.location.name}
                  width={400}
                  height={250}
                  className="rounded-lg mb-3 object-cover"
                />
              )}

              {/* Cancel Button */}
              <button
                onClick={() => handleCancelBooking(booking.id)}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs shadow transition"
              >
                ❌ Cancel
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
