import { Router } from 'express';
import { spawn } from 'child_process';
import path from 'path';

const router = Router();

router.post('/launch-activity', (req, res) => {
  const { activityId, command } = req.body;
  
  let cwd = '';
  if (activityId === '1') {
    cwd = path.join(process.cwd(), '../listening-comp');
  } else if (activityId === '2') {
    cwd = path.join(process.cwd(), '../writing-practice');
  }

  console.log('Launching activity in directory:', cwd);
  console.log('Command:', command);

  try {
    const [cmd, ...args] = command.split(' ');
    const process = spawn(cmd, args, {
      cwd,
      shell: true,
      stdio: 'inherit'
    });

    process.on('error', (err) => {
      console.error(`Failed to start activity ${activityId}:`, err);
      res.status(500).json({ error: 'Failed to launch activity' });
    });

    res.json({ success: true });
  } catch (error) {
    console.error(`Error launching activity ${activityId}:`, error);
    res.status(500).json({ error: 'Failed to launch activity' });
  }
});

export default router; 