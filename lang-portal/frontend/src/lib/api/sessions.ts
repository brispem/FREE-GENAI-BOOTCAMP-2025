import { API_CONFIG } from '@/config/api';

export async function startSession(groupId: string, activityType: string) {
  const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.STUDY_SESSIONS}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      group_id: groupId,
      activity_type: activityType
    })
  });

  if (!response.ok) {
    throw new Error('Failed to start session');
  }

  return response.json();
} 