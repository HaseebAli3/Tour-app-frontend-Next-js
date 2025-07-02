'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaGlobeAsia } from 'react-icons/fa';

export default function Home() {
  const backgrounds = [
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1493558103817-58b2924bce98?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
  ];

  const quotes = [
    { text: "The world is full of magic things, patiently waiting for our senses to grow sharper.", author: "W.B. Yeats" },
    { text: "Travel is the only thing you buy that makes you richer.", author: "Unknown" },
    { text: "Not all those who wander are lost.", author: "J.R.R. Tolkien" },
  ];

  const [currentBg, setCurrentBg] = useState(0);
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="relative w-screen h-screen bg-cover bg-center transition-all duration-1000"
      style={{ backgroundImage: `url(${backgrounds[currentBg]})` }}
    >
      {/* Very Light Overlay for Testing */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-none"></div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6">
        <div className="flex items-center mb-6">
          <FaGlobeAsia className="text-green-300 text-5xl mr-3 animate-pulse" />
          <h1 className="text-5xl font-extrabold tracking-wide">Nomadic Travel</h1>
        </div>

        <p className="text-lg md:text-xl max-w-2xl mb-6 text-gray-200">
          Explore the world, find your next adventure, and create unforgettable memories.
        </p>

        <div className="bg-white/10 px-6 py-4 rounded-lg shadow-lg mb-8 max-w-xl animate-fade-in">
          <p className="italic text-lg">"{quotes[currentQuote].text}"</p>
          <p className="mt-2 text-sm text-gray-300">— {quotes[currentQuote].author}</p>
        </div>

        <Link href="/register">
          <button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white py-3 px-8 rounded-full text-lg font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300 animate-bounce-slow">
            Start Your Journey
          </button>
        </Link>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-in-out;
        }
        @keyframes bounceSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-slow {
          animation: bounceSlow 2s infinite;
        }
      `}</style>
    </div>
  );
}
