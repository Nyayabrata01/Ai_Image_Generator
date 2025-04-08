'use client';

import { useState } from 'react';

type Ad = {
  headline: string;
  description: string;
};

export default function AdGeneratorForm() {
  const [product, setProduct] = useState('');
  const [offer, setOffer] = useState('');
  const [audience, setAudience] = useState('');
  const [loading, setLoading] = useState(false);
  const [ads, setAds] = useState<Ad[]>([]);

  const generateKeywords = async (product: string, offer: string, audience: string) => {
    setLoading(true);
    setAds([]);

    try {
      const res = await fetch('/api/generate-ad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product, offer, audience }),
      });

      const data = await res.json();
      console.log('Response from API:', data);

      if (res.ok && Array.isArray(data.result)) {
        setAds(data.result);
      } else {
        setAds([]);
        alert(data.error || 'Failed to generate ads.');
      }
    } catch (err) {
      console.error('Error generating ads:', err);
      alert('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row">
        <input
          className="bg-gray-800 text-white p-3 rounded placeholder-gray-400"
          placeholder="Product/Service"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
        />
        <input
          className="bg-gray-800 text-white p-3 rounded placeholder-gray-400"
          placeholder="Offer (e.g. 50% off)"
          value={offer}
          onChange={(e) => setOffer(e.target.value)}
        />
        <input
          className="bg-gray-800 text-white p-3 rounded placeholder-gray-400"
          placeholder="Target Audience (e.g. students)"
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
        />
      </div>

      <button
        onClick={() => generateKeywords(product, offer, audience)}
        disabled={loading}
        className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition-colors"
      >
        {loading ? 'Generating...' : 'Generate Ads'}
      </button>

      {ads.length > 0 && (
        <div className="grid md:grid-cols-2 gap-4">
          {ads.map((ad, index) => (
            <div
              key={index}
              className="bg-gray-800 border border-gray-700 p-5 rounded-xl shadow hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold text-green-400">{ad.headline}</h3>
              <p className="text-gray-300 mt-2">{ad.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
