'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import Image from 'next/image';
import { FaMapMarkerAlt, FaDollarSign, FaSearchLocation, FaRegSadTear } from 'react-icons/fa';

export default function Locations() {
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const token = Cookies.get('accessToken');
        const res = await axios.get('http://127.0.0.1:8000/api/location/list/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLocations(res.data);
        setFilteredLocations(res.data);
      } catch (err) {
        console.error('Error fetching locations:', err);
        setError('❌ Failed to load locations. Please login.');
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    const filtered = locations.filter((loc) =>
      loc.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLocations(filtered);
  }, [searchTerm, locations]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center text-green-700 text-xl font-semibold">
          Loading locations...
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center text-red-600 text-xl font-semibold">
          {error}
        </div>
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 p-6">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-green-800 shadow-sm">
          🌍 Explore Beautiful Locations
        </h1>

        {/* Search Input with Icon */}
        <div className="flex justify-center mb-8 relative max-w-md mx-auto">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Search locations by name..."
            className="w-full px-5 py-3 text-lg text-gray-800 placeholder-gray-500 border-2 border-green-500 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-green-500 pl-12"
          />
          <FaSearchLocation className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500 text-xl" />
        </div>

        {/* No results */}
        {filteredLocations.length === 0 ? (
          <div className="text-center text-red-600 text-lg font-semibold flex items-center justify-center gap-2">
            <FaRegSadTear /> No locations found for "<strong>{searchTerm}</strong>"
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filteredLocations.map((loc) => (
              <div
                key={loc.id}
                onClick={() =>
                  router.push({
                    pathname: '/locations/detail',
                    query: { data: JSON.stringify(loc) },
                  })
                }
                className="bg-white rounded-2xl shadow-xl hover:shadow-2xl p-4 cursor-pointer transition duration-300 group"
              >
                {/* Location Image */}
                {loc.images && loc.images.length > 0 && (
                  <Image
                    src={`http://127.0.0.1:8000${loc.images[0]}`}
                    alt={loc.name}
                    width={400}
                    height={250}
                    className="rounded-xl object-cover mb-4 transition-transform duration-300 group-hover:scale-105"
                  />
                )}

                {/* Location Name */}
                <h2 className="text-2xl font-bold text-green-800 mb-2 flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-green-500" /> {loc.name}
                </h2>

                {/* Price */}
                <p className="text-green-700 font-semibold mb-1 flex items-center">
                  <FaDollarSign className="mr-2 text-green-500" /> ${loc.price}
                </p>

                {/* Location Map Link */}
                {loc.location_url && (
                  <a
                    href={loc.location_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline text-sm flex items-center gap-1 hover:text-blue-800"
                    onClick={(e) => e.stopPropagation()}
                  >
                    📍 View on Map
                  </a>
                )}

                {/* Short Description */}
                <p className="text-gray-600 text-sm mt-2">
                  {loc.description.substring(0, 80)}...
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
