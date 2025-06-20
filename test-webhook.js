const axios = require('axios');

// Test function to send requests to the webhook
async function testWebhook(webhookUrl) {
  try {
    const testData = {
      message: 'Test request from external app',
      timestamp: new Date().toISOString(),
      data: {
        userId: Math.floor(Math.random() * 1000),
        action: 'test_action',
        metadata: {
          source: 'test-script',
          version: '1.0.0'
        }
      }
    };

    console.log('Sending request to:', webhookUrl);
    console.log('Request data:', JSON.stringify(testData, null, 2));

    const response = await axios.post(webhookUrl, testData, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'TestApp/1.0'
      }
    });

    console.log('Response:', response.data);
    console.log('Status:', response.status);
  } catch (error) {
    console.error('Error sending request:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

// Example usage
if (require.main === module) {
  const webhookUrl = process.argv[2];
  
  if (!webhookUrl) {
    console.log('Usage: node test-webhook.js <webhook-url>');
    console.log('Example: node test-webhook.js http://localhost:3001/api/webhook/abc123');
    process.exit(1);
  }

  // Send multiple test requests
  console.log('Starting webhook tests...\n');
  
  for (let i = 1; i <= 3; i++) {
    console.log(`\n--- Test Request ${i} ---`);
    await testWebhook(webhookUrl);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds between requests
  }
  
  console.log('\nTest completed!');
}

module.exports = { testWebhook }; 