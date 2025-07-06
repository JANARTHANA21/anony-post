import React, { useState } from 'react';
import Posts from '../components/Posts';
import AddPosts from '../components/AddPosts';

const PostsUI = () => {
  const countries = [
    { code: 'GLOBAL', name: '🌍 Global' },
    { code: 'IN', name: '🇮🇳 India' },
    { code: 'US', name: '🇺🇸 United States' },
    { code: 'UK', name: '🇬🇧 United Kingdom' },
    { code: 'CA', name: '🇨🇦 Canada' },
    { code: 'AU', name: '🇦🇺 Australia' },
  ];

  const [countryName, setCountryName] = useState('GLOBAL');

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-slate-900 text-white px-4 py-8">
      <header className="text-center mb-10 animate-fadeIn">
        <h1 className="text-4xl font-extrabold tracking-wide text-white drop-shadow-glow mb-4">
          🌐 Anonymous Posts
        </h1>

        <div className="flex flex-col items-center gap-3 mb-6">
          <label htmlFor="country" className="text-lg font-medium text-indigo-300">
            Filter by Country
          </label>
          <select
            id="country"
            name="country"
            value={countryName}
            onChange={(e) => setCountryName(e.target.value)}
            className="w-60 p-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          >
            {countries.map((country) => (
              <option key={country.code} value={country.code} className="bg-slate-800 text-white">
                {country.name}
              </option>
            ))}
          </select>
        </div>

        <div className="max-w-2xl mx-auto">
          <AddPosts />
        </div>
      </header>

      <main className="animate-fadeInSlow">
        <Posts countryname={countryName} />
      </main>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInSlow {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-fadeInSlow {
          animation: fadeInSlow 1.2s ease-out;
        }
        .drop-shadow-glow {
          text-shadow: 0 0 8px #c084fc, 0 0 14px #6366f1;
        }
      `}</style>
    </div>
  );
};

export default PostsUI;