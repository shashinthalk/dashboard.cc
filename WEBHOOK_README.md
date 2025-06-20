# Request Listener - Webhook System

This implementation provides a real-time request listener that can capture and display incoming JSON requests from external applications.

## Features

- **URL Generator**: Creates unique webhook URLs for receiving requests
- **Real-time Updates**: Uses Socket.IO for instant request display
- **Request History**: Shows all received requests in a table format
- **JSON Support**: Handles JSON request bodies with proper formatting
- **Connection Status**: Visual indicators for server connection status
- **Copy to Clipboard**: Easy URL copying for external use

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Application

You can run both the React app and webhook server simultaneously:

```bash
npm run dev
```

Or run them separately:

```bash
# Terminal 1 - Start the webhook server
npm run server

# Terminal 2 - Start the React app
npm start
```

### 3. Using the Request Listener

1. **Open the Recent Activity window** in your dashboard
2. **Set the server port** (default: 3001)
3. **Click "Generate Webhook URL"** to create a unique endpoint
4. **Copy the generated URL** using the copy button
5. **Send POST requests** to the URL from external applications

## Sending Test Requests

### Using the Test Script

```bash
node test-webhook.js http://localhost:3001/api/webhook/YOUR_GENERATED_ID
```

### Using curl

```bash
curl -X POST http://localhost:3001/api/webhook/YOUR_GENERATED_ID \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello from curl",
    "timestamp": "2024-01-01T12:00:00Z",
    "data": {
      "userId": 123,
      "action": "test"
    }
  }'
```

### Using JavaScript/Node.js

```javascript
const axios = require('axios');

const response = await axios.post('http://localhost:3001/api/webhook/YOUR_GENERATED_ID', {
  message: 'Hello from Node.js',
  timestamp: new Date().toISOString(),
  data: {
    userId: 456,
    action: 'test_action'
  }
}, {
  headers: {
    'Content-Type': 'application/json'
  }
});
```

### Using Python

```python
import requests
import json

data = {
    "message": "Hello from Python",
    "timestamp": "2024-01-01T12:00:00Z",
    "data": {
        "userId": 789,
        "action": "test_action"
    }
}

response = requests.post(
    'http://localhost:3001/api/webhook/YOUR_GENERATED_ID',
    json=data,
    headers={'Content-Type': 'application/json'}
)
```

## Request Display

The component displays the following information for each received request:

- **Timestamp**: When the request was received
- **Method**: HTTP method (POST, GET, etc.)
- **URL**: The endpoint that received the request
- **Headers**: All request headers
- **Body**: The JSON request body (formatted)
- **Status**: Request processing status

## Architecture

- **Frontend**: React component with Socket.IO client
- **Backend**: Express.js server with Socket.IO
- **Communication**: Real-time bidirectional communication
- **Port**: Configurable server port (default: 3001)

## Customization

### Changing the Server Port

1. Update the port in the React component
2. Update the server port in `server.js`
3. Update the webhook URL generation logic

### Adding Request Validation

Modify the webhook endpoint in `server.js` to add validation:

```javascript
app.post('/api/webhook/:id', (req, res) => {
  // Add your validation logic here
  if (!req.body || !req.body.message) {
    return res.status(400).json({ error: 'Invalid request body' });
  }
  
  // Process the request...
});
```

### Persisting Requests

To persist requests to a database, modify the server to save requests:

```javascript
// Example with a simple file-based storage
const fs = require('fs');

app.post('/api/webhook/:id', (req, res) => {
  const requestData = {
    id: Math.random().toString(36).substring(2, 15),
    timestamp: new Date(),
    method: req.method,
    url: req.originalUrl,
    headers: req.headers,
    body: req.body,
    status: 'success'
  };

  // Save to file
  fs.appendFileSync('requests.json', JSON.stringify(requestData) + '\n');
  
  // Emit to connected clients
  io.emit('newRequest', requestData);
  
  res.status(200).json({ success: true });
});
```

## Troubleshooting

### Connection Issues

1. **Check if the server is running**: Ensure the webhook server is started
2. **Verify the port**: Make sure the port matches between client and server
3. **Check firewall settings**: Ensure the port is not blocked

### Request Not Appearing

1. **Check the URL**: Verify you're using the correct generated URL
2. **Check the method**: Ensure you're sending POST requests
3. **Check the content type**: Set `Content-Type: application/json`
4. **Check the server logs**: Look for any error messages

### CORS Issues

The server is configured to allow requests from `http://localhost:3000`. If you're running the React app on a different port, update the CORS configuration in `server.js`. 