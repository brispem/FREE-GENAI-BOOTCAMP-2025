const handleLaunch = async () => {
  try {
    console.log(`Launching activity ${activityId}`);
    
    const response = await fetch('http://localhost:5000/api/launch-activity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ activityId })
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const data = await response.json();
    console.log('Launch response:', data);
    
    if (!data.success) {
      throw new Error('Failed to launch activity');
    }

    // Open activity in new window/tab
    const port = activityId === '1' ? 8501 : 8081;
    const url = `http://localhost:${port}`;
    console.log(`Opening activity at ${url}`);
    window.open(url, '_blank');

  } catch (error) {
    console.error('Error launching activity:', error);
    setError(`Error launching activity: ${error.message}`);
  }
}; 