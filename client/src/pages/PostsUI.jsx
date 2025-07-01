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
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">🌐 Anonymous Posts</h1>
        
        <div className="mb-4">
          <label htmlFor="country" className="block mb-1 text-gray-700 font-medium">
            Filter by Country
          </label>
          <select
            id="country"
            name="country"
            value={countryName}
            onChange={(e) => setCountryName(e.target.value)}
            className="p-2 border rounded w-60"
          >
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        <AddPosts />
      </header>

      <main>
        <Posts countryname={countryName} />
      </main>
    </div>
  );
};

export default PostsUI;