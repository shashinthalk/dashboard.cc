const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Store webhook endpoints
const webhookEndpoints = new Map();

// Webhook endpoint handler
app.post('/api/webhook/:id', (req, res) => {
  const { id } = req.params;
  const requestData = {
    id: Math.random().toString(36).substring(2, 15),
    timestamp: new Date(),
    method: req.method,
    url: req.originalUrl,
    headers: req.headers,
    body: req.body,
    status: 'success'
  };

  // Emit the request data to connected clients
  io.emit('newRequest', requestData);
  
  console.log(`Webhook received for endpoint ${id}:`, requestData);
  
  res.status(200).json({ 
    success: true, 
    message: 'Request received',
    requestId: requestData.id 
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Socket connection handler
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Webhook server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

module.exports = { app, server, io }; 