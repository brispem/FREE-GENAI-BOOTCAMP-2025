import { Router } from 'express';
import { prisma } from '../db';

const router = Router();

router.get('/api/dashboard', async (req, res) => {
  try {
    // Get user's study sessions
    const studySessions = await prisma.studySession.findMany({
      where: {
        userId: req.user?.id // Make sure user is authenticated
      },
      include: {
        attempts: true // Include all attempts
      }
    });

    // Get user's word groups
    const activeGroups = await prisma.wordGroup.findMany({
      where: {
        userId: req.user?.id
      }
    });

    // Calculate success rate from attempts
    const attempts = studySessions.flatMap(session => session.attempts);
    const successRate = attempts.length > 0
      ? (attempts.filter(a => a.isCorrect).length / attempts.length) * 100
      : 0;

    // Get total words learned
    const wordsLearned = await prisma.word.count({
      where: {
        groups: {
          some: {
            userId: req.user?.id
          }
        }
      }
    });

    res.json({
      studySessionCount: studySessions.length,
      wordsLearned,
      activeGroupCount: activeGroups.length,
      successRate
    });

  } catch (error) {
    console.error('Dashboard data fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

export default router; 