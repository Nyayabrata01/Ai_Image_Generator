import { useState } from 'react';

export const useKeywordGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const generateKeywords = async (product: string, offer: string, audience: string) => {
    setLoading(true);
    setResult('');

    try {
      const res = await fetch('/api/generate-ad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product, offer, audience }),
      });

      const data = await res.json();

      if (res.ok) {
        setResult(data.result);
      } else {
        setResult(data.error || 'Failed to generate keywords');
      }
    } catch (err) {
      console.error('Error generating keywords:', err);
      setResult('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return { generateKeywords, result, loading };
};
