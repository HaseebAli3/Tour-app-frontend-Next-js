'use client';
import Link from 'next/link';
import { FaMapMarkedAlt, FaListAlt } from 'react-icons/fa';

export default function Header() {
  return (
    <nav className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 px-6 flex flex-col md:flex-row md:justify-between md:items-center shadow-md">
      
      {/* App Title with Icon */}
      <div className="flex items-center gap-2 text-2xl font-bold mb-3 md:mb-0">
        <FaMapMarkedAlt className="text-white text-3xl" />
        Nomadic Travel
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col md:flex-row gap-3">
        <Link href="/locations">
          <button className="bg-white text-green-700 font-semibold px-4 py-2 rounded-full hover:bg-green-100 shadow transition">
            🌍 Locations
          </button>
        </Link>

        <Link href="/bookings">
          <button className="bg-white text-green-700 font-semibold px-4 py-2 rounded-full hover:bg-green-100 shadow transition flex items-center gap-2">
            <FaListAlt /> My Bookings
          </button>
        </Link>
      </div>
    </nav>
  );
}
