const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const net = require('net');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Function to check if a port is available
const isPortAvailable = (port) => {
  return new Promise((resolve) => {
    const tester = net.createServer()
      .once('error', () => resolve(false))
      .once('listening', () => {
        tester.once('close', () => resolve(true))
          .close();
      })
      .listen(port);
  });
};

// Function to find an available port
const findAvailablePort = async (startPort = 3000) => {
  let port = startPort;
  while (!(await isPortAvailable(port))) {
    port++;
    if (port > startPort + 100) { // Limit search to 100 ports
      throw new Error(`No available ports found between ${startPort} and ${startPort + 100}`);
    }
  }
  return port;
};

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

// Status endpoint with port information
app.get('/status', (req, res) => {
  const fs = require('fs');
  let webhookPort = 'unknown';
  try {
    if (fs.existsSync('.webhook-port')) {
      webhookPort = fs.readFileSync('.webhook-port', 'utf8').trim();
    }
  } catch (error) {
    // Ignore file read errors
  }
  
  res.status(200).json({
    status: 'running',
    timestamp: new Date().toISOString(),
    ports: {
      webhook: webhookPort,
      react: 3001
    },
    urls: {
      react: `http://localhost:3001`,
      webhook: `http://localhost:${webhookPort}/api/webhook/*`,
      health: `http://localhost:${webhookPort}/health`,
      status: `http://localhost:${webhookPort}/status`
    }
  });
});

// Serve webhook port file for React app
app.get('/.webhook-port', (req, res) => {
  try {
    const fs = require('fs');
    if (fs.existsSync('.webhook-port')) {
      const port = fs.readFileSync('.webhook-port', 'utf8');
      res.setHeader('Content-Type', 'text/plain');
      res.send(port);
    } else {
      res.status(404).send('Port file not found');
    }
  } catch (error) {
    res.status(500).send('Error reading port file');
  }
});

// Socket connection handler
io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    // Connection closed
  });
});

// Serve React app in development mode
if (process.env.NODE_ENV !== 'production') {
  console.log('🔧 Development mode: Starting React development server...');
  
  // Start React development server on a different port
  const { spawn } = require('child_process');
  
  const reactProcess = spawn('npx', ['react-scripts', 'start'], {
    stdio: 'inherit',
    shell: true,
    env: {
      ...process.env,
      PORT: 3001, // React will run on 3001
      BROWSER: 'none' // Prevent auto-opening browser
    }
  });

  reactProcess.on('error', (error) => {
    console.error('Failed to start React development server:', error);
  });

  reactProcess.on('close', (code) => {
    console.log(`React development server exited with code ${code}`);
  });
}

// Start the webhook server on an available port
const startServer = async () => {
  try {
    // Start from port 3002 to avoid conflicts with React (3001)
    const webhookPort = await findAvailablePort(3002);
    
    server.listen(webhookPort, () => {
      console.log('\n' + '='.repeat(60));
      console.log('🚀 WEBHOOK SERVER STARTED SUCCESSFULLY');
      console.log('='.repeat(60));
      console.log(`📡 Webhook Server Port: ${webhookPort}`);
      console.log(`🔗 Socket.IO Server Port: ${webhookPort}`);
      console.log(`⚛️  React App Port: 3001`);
      console.log('');
      console.log('📋 IMPORTANT: Update your React component to connect to port', webhookPort);
      console.log('');
      console.log('🔗 URLs:');
      console.log(`   • React App: http://localhost:3001`);
      console.log(`   • Webhook Endpoints: http://localhost:${webhookPort}/api/webhook/*`);
      console.log(`   • Health Check: http://localhost:${webhookPort}/health`);
      console.log('');
      console.log('💡 To test webhook:');
      console.log(`   curl -X POST http://localhost:${webhookPort}/api/webhook/test123 \\`);
      console.log(`     -H "Content-Type: application/json" \\`);
      console.log(`     -d '{"message": "Hello from curl!"}'`);
      console.log('='.repeat(60) + '\n');
      
      // Save the port to a file so React can read it
      const fs = require('fs');
      fs.writeFileSync('.webhook-port', webhookPort.toString());
      
      // Also save to a more visible file
      fs.writeFileSync('WEBHOOK_PORT.txt', `Webhook Server Port: ${webhookPort}\nReact App Port: 3001\n\nTest with:\ncurl -X POST http://localhost:${webhookPort}/api/webhook/test123 -H "Content-Type: application/json" -d '{"message": "Hello!"}'`);
      
      // Keep the port visible in the terminal
      setInterval(() => {
        console.log(`🔄 Webhook server still running on port ${webhookPort} - React app on port 3001`);
      }, 30000); // Show every 30 seconds
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  // Clean up the port file
  try {
    const fs = require('fs');
    if (fs.existsSync('.webhook-port')) {
      fs.unlinkSync('.webhook-port');
    }
  } catch (error) {
    // Ignore cleanup errors
  }
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

// Start the server
startServer();

module.exports = { app, server, io }; 