export async function startSession(groupId: string, activityType: string) {
  const response = await fetch('http://localhost:5000/api/sessions', {
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