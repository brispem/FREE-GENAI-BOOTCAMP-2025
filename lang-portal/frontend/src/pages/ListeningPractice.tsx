import { useEffect } from 'react';

export default function ListeningPractice() {
  useEffect(() => {
    // Redirect to the Streamlit listening practice app
    window.location.href = 'http://localhost:8501';
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Redirecting to Listening Practice...</h1>
    </div>
  );
} 