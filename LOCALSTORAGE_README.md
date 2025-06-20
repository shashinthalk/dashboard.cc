# LocalStorage Persistence Feature

This document explains the localStorage persistence feature that has been implemented to solve the issue of data loss when refreshing the page or opening new browser windows.

## Problem Solved

Previously, when users:
- Created webhook URLs
- Entered HTTP request details (URL, method, body)
- Received webhook requests
- Refreshed the page or opened a new window

All the data would be lost. Now, all this data is automatically saved to the browser's localStorage and restored when the page loads.

## Features Implemented

### 1. HTTP Request Handler Persistence
- **URL**: Saved and restored
- **HTTP Method**: Saved and restored  
- **Request Body**: Saved and restored
- **Response**: Saved and restored
- **Status Code**: Saved and restored

### 2. Webhook Listener Persistence
- **Generated Webhook URL**: Saved and restored
- **Server Port**: Saved and restored
- **Received Requests**: Saved and restored
- **Connection Status**: Automatically reconnects if URL exists

### 3. Custom useLocalStorage Hook
A reusable hook that provides:
- Automatic localStorage persistence
- Error handling for localStorage operations
- Cross-tab/window synchronization
- TypeScript support
- Specialized hooks for common data types

## How It Works

### Automatic Persistence
All form inputs and data are automatically saved to localStorage whenever they change:

```typescript
// Example from UserHTTPRequestHandler
const [url, setUrl] = useLocalStorageString('http-request-url', 'https://jsonplaceholder.typicode.com/posts');
const [method, setMethod] = useLocalStorageString('http-request-method', 'GET');
const [requestBody, setRequestBody] = useLocalStorageString('http-request-body', '');
```

### Data Restoration
When the component mounts, it automatically loads saved data from localStorage:

```typescript
// The hook automatically handles loading from localStorage
const [requests, setRequests] = useLocalStorageArray<RequestData>('webhook-requests', []);
```

### Error Handling
All localStorage operations are wrapped in try-catch blocks to handle cases where:
- localStorage is not available (private browsing)
- localStorage is full
- localStorage is disabled

## localStorage Keys Used

### HTTP Request Handler
- `http-request-url`: The target URL for HTTP requests
- `http-request-method`: The HTTP method (GET, POST, etc.)
- `http-request-body`: The request body JSON
- `http-request-response`: The response from the server
- `http-request-status`: The HTTP status code

### Webhook Listener
- `webhook-url`: The generated webhook URL
- `webhook-server-port`: The server port for webhook connections
- `webhook-requests`: Array of received webhook requests

## User Interface

### Clear Buttons
Both components now have clear buttons to manage saved data:

**HTTP Request Handler:**
- **Clear All Data**: Resets all fields to default values
- **Clear Response**: Only clears the response and status

**Webhook Listener:**
- **Clear Requests**: Only clears the received requests
- **Clear All**: Clears everything including the webhook URL
- **Reset Port**: Resets the server port to default (3000)

### Visual Feedback
- Connection status indicators
- Request counters
- Status badges for HTTP responses

## Testing

You can test the localStorage persistence using the provided test file:

```bash
# Open the test file in your browser
open test-persistence.html
```

This test file allows you to:
- Save and load test data
- View all localStorage keys
- Clear specific data or all data
- Verify persistence across page refreshes

## Technical Implementation

### Custom Hook: useLocalStorage
```typescript
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void]
```

**Features:**
- Generic type support
- Automatic JSON serialization/deserialization
- Error handling
- Cross-tab synchronization
- Clear function for removing data

### Specialized Hooks
- `useLocalStorageString`: For string values
- `useLocalStorageNumber`: For number values
- `useLocalStorageBoolean`: For boolean values
- `useLocalStorageArray`: For array values

## Browser Compatibility

The localStorage persistence works in all modern browsers:
- Chrome 4+
- Firefox 3.5+
- Safari 4+
- Edge 12+
- Internet Explorer 8+

## Limitations

1. **Storage Limit**: localStorage has a size limit (usually 5-10MB)
2. **Private Browsing**: localStorage may not be available in private/incognito mode
3. **Cross-Origin**: localStorage is domain-specific
4. **Manual Clearing**: Users can clear localStorage manually through browser settings

## Future Enhancements

Potential improvements:
1. **Data Compression**: Compress large data before storing
2. **Expiration**: Add TTL for stored data
3. **Backup/Restore**: Export/import localStorage data
4. **Sync**: Sync data across devices (requires backend)
5. **Encryption**: Encrypt sensitive data before storing

## Troubleshooting

### Data Not Persisting
1. Check if localStorage is available: `typeof localStorage !== 'undefined'`
2. Check browser console for errors
3. Verify localStorage is not disabled in browser settings
4. Check if in private browsing mode

### Data Not Loading
1. Check if the localStorage key exists: `localStorage.getItem('key')`
2. Verify the data format is valid JSON
3. Check browser console for parsing errors

### Performance Issues
1. Large amounts of data in localStorage can slow down the app
2. Consider implementing data cleanup/archiving
3. Monitor localStorage usage: `JSON.stringify(localStorage).length`

## Usage Examples

### Basic Usage
```typescript
const [value, setValue, clearValue] = useLocalStorage('my-key', 'default');
```

### With TypeScript
```typescript
interface UserData {
  name: string;
  email: string;
}

const [userData, setUserData, clearUserData] = useLocalStorage<UserData>('user-data', {
  name: '',
  email: ''
});
```

### Clearing Data
```typescript
// Clear specific value
clearValue();

// Clear all data
localStorage.clear();
```

This implementation ensures that users never lose their work when refreshing the page or opening new browser windows, providing a much better user experience. 