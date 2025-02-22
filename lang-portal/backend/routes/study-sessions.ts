router.post('/api/study-sessions/:sessionId/attempts', async (req, res) => {
  const { sessionId } = req.params;
  const { activity_type, content, attempt, feedback, is_correct, timestamp } = req.body;

  try {
    // Save attempt to database
    const attempt = await prisma.studyAttempt.create({
      data: {
        sessionId,
        activityType: activity_type,
        content,
        attempt,
        feedback,
        isCorrect: is_correct,
        timestamp: new Date(timestamp)
      }
    });

    res.json({ success: true, attempt });
  } catch (error) {
    console.error('Error saving study attempt:', error);
    res.status(500).json({ error: 'Failed to save study attempt' });
  }
}); 