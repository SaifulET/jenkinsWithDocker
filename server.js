import express from 'express';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    framework: 'Node.js Express (ES6 Modules)',
    message: 'Welcome to MERN API - Running via DooD Jenkins Pipeline!'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
