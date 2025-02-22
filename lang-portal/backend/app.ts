import express from 'express';
import activitiesRouter from './routes/activities';
import dashboardRoutes from './routes/dashboard';

const app = express();

app.use(express.json());

// Register the activities router
app.use('/api', activitiesRouter);

// Register the dashboard routes
app.use('/', dashboardRoutes);

// ... rest of your app configuration

export default app; 