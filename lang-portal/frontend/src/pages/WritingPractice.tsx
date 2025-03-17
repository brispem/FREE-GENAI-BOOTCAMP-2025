import { useEffect } from 'react';

export default function WritingPractice() {
  useEffect(() => {
    window.location.href = 'http://localhost:8081';
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Redirecting to Writing Practice...</h1>
    </div>
  );
} 