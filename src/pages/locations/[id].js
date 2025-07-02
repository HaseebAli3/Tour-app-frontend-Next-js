'use client';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Image from 'next/image';

export default function LocationDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLocation = async () => {
      if (!id) return;

      try {
        const token = Cookies.get('accessToken');

        const res = await axios.get(`http://127.0.0.1:8000/api/location/get/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setLocation(res.data[0]);  // ✅ Assuming Django returns list with 1 object
      } catch (err) {
        console.error('Error fetching location:', err);
        setError('Location not found or unauthorized.');
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [id]);

  const handleBooking = async () => {
    try {
      const token = Cookies.get('accessToken');
      const today = new Date().toISOString().split('T')[0];

      await axios.post(
        'http://127.0.0.1:8000/api/booking/',
        {
          location: id,
          booking_date: today,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('✅ Booking successful!');
    } catch (err) {
      console.error('Booking failed:', err);
      alert('❌ Booking failed.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-yellow-50 p-8">
      <h1 className="text-4xl font-bold text-green-800 mb-4">{location.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Images */}
        <div>
          {location.images.map((img, idx) => (
            <Image
              key={idx}
              src={`http://127.0.0.1:8000${img.image}`}
              alt={`Image ${idx + 1}`}
              width={600}
              height={400}
              className="rounded mb-4 object-cover"
            />
          ))}
        </div>

        {/* Details */}
        <div>
          <p className="text-gray-700 text-lg mb-4">{location.description}</p>
          <p className="text-green-700 text-xl font-semibold mb-2">Price: ${location.price}</p>

          {location.location_url && (
            <a
              href={location.location_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline text-lg"
            >
              📍 View on Map
            </a>
          )}

          <button
            onClick={handleBooking}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded text-lg"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
