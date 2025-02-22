import express from 'express';
import { exec } from 'child_process';
import path from 'path';
import cors from 'cors';
import { existsSync } from 'fs';
import fetch from 'node-fetch';

const app = express();
app.use(cors());
app.use(express.json());

// Check if a port is in use
async function isPortInUse(port: number): Promise<boolean> {
  try {
    const response = await fetch(`http://localhost:${port}`);
    return true;
  } catch {
    return false;
  }
}

app.post('/api/launch-activity', async (req, res) => {
  const { activityId } = req.body;

  try {
    let command: string;
    let cwd: string;
    let port: number;

    if (activityId === '1') {  // Listening Practice
      cwd = path.join(__dirname, '../../listening-comp/frontend');
      const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
      command = `${pythonCmd} -m streamlit run main.py`;
      port = 8501;  // Streamlit port
    } else if (activityId === '2') {  // Writing Practice
      cwd = path.join(__dirname, '../../writing-practice');
      const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
      command = `${pythonCmd} app.py`;
      port = 8081;  // Gradio port
    }

    // Check if app is already running
    const isRunning = await isPortInUse(port);
    if (isRunning) {
      console.log(`App already running on port ${port}`);
      return res.json({ success: true });
    }

    console.log(`Launching in ${cwd}`);
    console.log(`Command: ${command}`);

    // Set environment variables for the activities
    const env = {
      ...process.env,
      PYTHONUNBUFFERED: '1',
      SESSION_ID: '1',  // TODO: Get from user session
      GROUP_ID: '1',    // TODO: Get from user selection
      FLASK_BACKEND_URL: 'http://localhost:5000',  // Point to Flask backend
      BACKEND_PORT: '5001',  // Tell activities to use port 5001 for backend
      API_BASE_URL: 'http://localhost:5001',  // Base URL for API calls
      STREAMLIT_SERVER_PORT: port.toString(),
      STREAMLIT_SERVER_ADDRESS: '0.0.0.0'
    };

    // Launch the process
    const child = exec(command, { cwd, env });

    // Log output for debugging
    child.stdout?.on('data', (data) => {
      console.log(`App output: ${data}`);
    });

    child.stderr?.on('data', (data) => {
      console.error(`App error: ${data}`);
    });

    // Wait for app to start with longer timeout
    let attempts = 0;
    const maxAttempts = 30;
    const checkInterval = setInterval(async () => {
      attempts++;
      try {
        const running = await isPortInUse(port);
        if (running) {
          clearInterval(checkInterval);
          console.log(`App started successfully on port ${port}`);
          return res.json({ success: true });
        }
      } catch (error) {
        console.error(`Attempt ${attempts}: ${error}`);
      }
      
      if (attempts >= maxAttempts) {
        clearInterval(checkInterval);
        child.kill();
        throw new Error(`Timeout waiting for app to start on port ${port}`);
      }
    }, 2000);

  } catch (error) {
    console.error('Launch error:', error);
    res.status(500).json({ error: 'Failed to launch activity' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`=== Backend Server Started ===`);
  console.log(`Server directory: ${__dirname}`);
  console.log(`Platform: ${process.platform}`);
  console.log(`Node version: ${process.version}`);
}); 