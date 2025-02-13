const BASE_URL = 'http://localhost:5000/api';

export const api = {
  // Vocabulary endpoints
  words: {
    getAll: async () => {
      const response = await fetch(`${BASE_URL}/words`);
      if (!response.ok) throw new Error('Failed to fetch words');
      return response.json();
    },
    
    add: async (word: { spanish: string; english: string; type: string }) => {
      const response = await fetch(`${BASE_URL}/words`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(word)
      });
      if (!response.ok) throw new Error('Failed to add word');
      return response.json();
    },
    
    delete: async (id: number) => {
      const response = await fetch(`${BASE_URL}/words/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete word');
      return response.json();
    }
  },

  // Practice endpoints
  practice: {
    saveScore: async (data: { wordId: number; correct: boolean }) => {
      const response = await fetch(`${BASE_URL}/practice/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to save score');
      return response.json();
    },
    
    getHistory: async () => {
      const response = await fetch(`${BASE_URL}/practice/history`);
      if (!response.ok) throw new Error('Failed to fetch practice history');
      return response.json();
    }
  }
}; 