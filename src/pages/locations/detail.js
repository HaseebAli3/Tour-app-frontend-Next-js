'use client';

import { useRouter } from 'next/router';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { FaMapMarkerAlt, FaDollarSign, FaCalendarAlt } from 'react-icons/fa';

export default function LocationDetail() {
  const router = useRouter();
  const { data } = router.query;

  const [location, setLocation] = useState(null);
  const [message, setMessage] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data) {
      try {
        const parsedLocation = JSON.parse(data);
        setLocation(parsedLocation);
      } catch (err) {
        console.error('Error parsing location data:', err);
        setMessage('❌ Invalid location data.');
      }
    }
  }, [data]);

  const handleBooking = async () => {
    const token = Cookies.get('accessToken');

    if (!token) {
      setMessage('❌ Please login first to book.');
      return;
    }

    if (!bookingDate) {
      setMessage('❌ Please select a booking date.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/bookings/',
        {
          location: location.id,
          booking_date: bookingDate,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log('Booking Response:', response.data);
      setMessage('✅ Booking successful!');
    } catch (error) {
      console.error('Booking Error:', error);
      setMessage('❌ Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!location) {
    return (
      <div className="min-h-screen flex items-center justify-center text-green-700 text-lg font-semibold">
        Loading location details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 p-6">
      <h1 className="text-4xl font-extrabold text-center text-green-800 mb-6">
        {location.name}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          {location.images && location.images.length > 0 ? (
            location.images.map((img, idx) => (
              <Image
                key={idx}
                src={`http://127.0.0.1:8000${img}`}
                alt={`Image ${idx + 1}`}
                width={600}
                height={400}
                className="rounded-xl shadow-md object-cover mb-4"
              />
            ))
          ) : (
            <p className="text-gray-600">No images available for this location.</p>
          )}
        </div>

        {/* Details */}
        <div className="bg-white shadow-xl rounded-xl p-6 space-y-4">
          {/* Description */}
          <p className="text-gray-800 text-lg leading-relaxed">{location.description}</p>

          {/* Price */}
          <p className="text-green-700 text-xl font-bold flex items-center">
            <FaDollarSign className="mr-2 text-green-500" /> ${location.price}
          </p>

          {/* Google Map Link */}
          {location.location_url && (
            <a
              href={location.location_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline text-lg flex items-center gap-1"
            >
              <FaMapMarkerAlt /> View on Google Maps
            </a>
          )}

          {/* Date Picker */}
          <div>
            <label className="block text-gray-700 mb-1 text-sm flex items-center">
              <FaCalendarAlt className="mr-2 text-green-500" /> Select Booking Date:
            </label>
            <input
              type="date"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              className="w-full bg-white text-gray-800 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Booking Button */}
          <button
            onClick={handleBooking}
            disabled={loading}
            className={`w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white py-3 rounded-lg font-semibold shadow-md transition transform hover:scale-105 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Booking...' : 'Book Now'}
          </button>

          {/* Message */}
          {message && (
            <p
              className={`mt-2 text-center text-sm ${
                message.startsWith('✅') ? 'text-green-700' : 'text-red-700'
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
