import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import io from 'socket.io-client';
import { StyledCodeEditor } from './WindowContentWrapper';
import { useLocalStorageArray, useLocalStorageString, useLocalStorageNumber } from '../../shared/hooks/useLocalStorage';

// Styled components for the request listener UI
const RequestListenerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
`;

const UrlGeneratorSection = styled.div`
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 15px;
`;

const UrlDisplay = styled.div`
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 4px;
  padding: 10px;
  margin: 10px 0;
  font-family: 'Courier New', monospace;
  word-break: break-all;
  position: relative;
`;

const CopyButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: #007acc;
  color: white;
  border: none;
  border-radius: 3px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
  
  &:hover {
    background: #005a9e;
  }
`;

const GenerateButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background: #218838;
  }
`;

const RequestsSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const RequestsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #333;
`;

const ClearButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 12px;
  
  &:hover {
    background: #c82333;
  }
`;

const RequestsTable = styled.div`
  flex: 1;
  overflow-y: auto;
  border: 1px solid #333;
  border-radius: 4px;
`;

const RequestRow = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr 100px;
  gap: 10px;
  padding: 10px;
  border-bottom: 1px solid #333;
  font-size: 12px;
  
  &:hover {
    background: #1a1a1a;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const RequestHeader = styled(RequestRow)`
  background: #2a2a2a;
  font-weight: bold;
  position: sticky;
  top: 0;
`;

const RequestData = styled.pre`
  background: #1a1a1a;
  border: 1px solid #444;
  border-radius: 4px;
  padding: 8px;
  margin: 5px 0;
  font-size: 11px;
  max-height: 200px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-break: break-word;
`;

const StatusBadge = styled.span<{ status: string }>`
  background: ${props => 
    props.status === 'success' ? '#28a745' : 
    props.status === 'error' ? '#dc3545' : '#ffc107'
  };
  color: ${props => props.status === 'warning' ? '#000' : '#fff'};
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: bold;
`;

// Types for request data
interface RequestData {
  id: string;
  timestamp: Date | string;
  method: string;
  url: string;
  headers: Record<string, string>;
  body: any;
  status: 'success' | 'error' | 'warning';
}

const RecentActivityContent = () => {
  // Use custom localStorage hooks for better state management
  const [requests, setRequests, clearRequests] = useLocalStorageArray<RequestData>('webhook-requests', []);
  const [currentUrl, setCurrentUrl, clearCurrentUrl] = useLocalStorageString('webhook-url', '');
  const [serverPort, setServerPort, clearServerPort] = useLocalStorageNumber('webhook-server-port', 3000);
  
  const [isListening, setIsListening] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const socketRef = useRef<any>(null);

  // Auto-detect webhook server port
  useEffect(() => {
    const detectPort = async () => {
      // Try ports from 3002 to 3010 (avoiding React's port 3001)
      for (let port = 3002; port <= 3010; port++) {
        try {
          const response = await fetch(`http://localhost:${port}/health`);
          if (response.ok) {
            setServerPort(port);
            return;
          }
        } catch (error) {
          // Port not available, continue to next
        }
      }
    };

    detectPort();
    
    // Poll every 5 seconds to detect port changes
    const interval = setInterval(detectPort, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Connect to the webhook server
  const connectToServer = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    setConnectionStatus('connecting');
    
    const socket = io(`http://localhost:${serverPort}`);
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnectionStatus('connected');
      setIsListening(true);
    });

    socket.on('disconnect', () => {
      setConnectionStatus('disconnected');
      setIsListening(false);
    });

    socket.on('newRequest', (requestData: RequestData) => {
      // Ensure timestamp is a Date object
      const processedRequest = {
        ...requestData,
        timestamp: new Date(requestData.timestamp)
      };
      setRequests(prev => [processedRequest, ...prev]);
    });

    socket.on('connect_error', (error: Error) => {
      setConnectionStatus('disconnected');
      setIsListening(false);
    });

    return socket;
  }, [serverPort]);

  // Auto-connect if there's a saved URL
  useEffect(() => {
    if (currentUrl && serverPort !== 3000) {
      connectToServer();
    }
  }, [currentUrl, serverPort, connectToServer]);

  // Generate a unique URL for the listener
  const generateUrl = useCallback(() => {
    const port = serverPort;
    const uniqueId = Math.random().toString(36).substring(2, 15);
    const url = `http://localhost:${port}/api/webhook/${uniqueId}`;
    setCurrentUrl(url);
    return url;
  }, [serverPort]);

  // Copy URL to clipboard
  const copyUrl = async () => {
    if (currentUrl) {
      try {
        await navigator.clipboard.writeText(currentUrl);
        alert('URL copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy URL:', err);
      }
    }
  };

  // Clear everything (requests and URL)
  const clearAll = () => {
    setRequests([]);
    setCurrentUrl('');
    setServerPort(3000);
  };

  // Clear only requests
  const clearRequestsOnly = () => {
    setRequests([]);
  };

  // Reset server port to default
  const resetServerPort = () => {
    setServerPort(3000);
  };

  // Start listening when URL is generated
  const handleGenerateUrl = () => {
    const url = generateUrl();
    connectToServer();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Format timestamp
  const formatTimestamp = (date: Date | string) => {
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      return dateObj.toLocaleTimeString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Format request body for display
  const formatRequestBody = (body: any) => {
    try {
      return JSON.stringify(body, null, 2);
    } catch {
      return String(body);
    }
  };

  // Get connection status color
  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return '#28a745';
      case 'connecting': return '#ffc107';
      case 'disconnected': return '#dc3545';
      default: return '#6c757d';
    }
  };

  // Get connection status text
  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Connected';
      case 'connecting': return 'Connecting...';
      case 'disconnected': return 'Disconnected';
      default: return 'Unknown';
    }
  };

  return (
    <StyledCodeEditor>
      <RequestListenerContainer>
        <UrlGeneratorSection>
          <h3 style={{ margin: '0 0 15px 0', color: '#fff' }}>Request Listener</h3>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#ccc' }}>
              Server Port:
            </label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="number"
                value={serverPort}
                onChange={(e) => setServerPort(Number(e.target.value))}
                style={{
                  background: '#2a2a2a',
                  border: '1px solid #444',
                  borderRadius: '4px',
                  padding: '8px',
                  color: '#fff',
                  width: '100px'
                }}
              />
              <button
                onClick={resetServerPort}
                style={{
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '8px 12px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
                title="Reset to default port (3000)"
              >
                Reset
              </button>
            </div>
          </div>

          {currentUrl ? (
            <UrlDisplay>
              <strong style={{ color: '#28a745' }}>Generated URL:</strong>
              <div style={{ marginTop: '5px' }}>{currentUrl}</div>
              <CopyButton onClick={copyUrl}>Copy</CopyButton>
            </UrlDisplay>
          ) : (
            <GenerateButton onClick={handleGenerateUrl}>
              Generate Webhook URL
            </GenerateButton>
          )}

          {currentUrl && (
            <div style={{ 
              marginTop: '10px', 
              padding: '8px', 
              background: getConnectionStatusColor(), 
              borderRadius: '4px',
              color: 'white',
              fontSize: '12px'
            }}>
              {connectionStatus === 'connected' ? '✓' : connectionStatus === 'connecting' ? '⟳' : '✗'} {getConnectionStatusText()}
            </div>
          )}
        </UrlGeneratorSection>

        <RequestsSection>
          <RequestsHeader>
            <h3 style={{ margin: 0, color: '#fff' }}>
              Received Requests ({requests.length})
            </h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              {requests.length > 0 && (
                <ClearButton onClick={clearRequestsOnly}>
                  Clear Requests
                </ClearButton>
              )}
              {(requests.length > 0 || currentUrl) && (
                <ClearButton onClick={clearAll}>
                  Clear All
                </ClearButton>
              )}
            </div>
          </RequestsHeader>

          <RequestsTable>
            {requests.length === 0 ? (
              <div style={{ 
                padding: '20px', 
                textAlign: 'center', 
                color: '#666',
                fontStyle: 'italic'
              }}>
                {connectionStatus === 'connected' 
                  ? 'No requests received yet. Send a POST request to the generated URL to see it here.'
                  : 'Connect to the server to start receiving requests.'
                }
              </div>
            ) : (
              <>
                <RequestHeader>
                  <div>Time</div>
                  <div>Request Data</div>
                  <div>Status</div>
                </RequestHeader>
                {requests.map((request) => (
                  <div key={request.id}>
                    <RequestRow>
                      <div>{formatTimestamp(request.timestamp)}</div>
                      <div>
                        <strong>Method:</strong> {request.method}<br/>
                        <strong>URL:</strong> {request.url}<br/>
                        <strong>Headers:</strong>
                        <RequestData>
                          {JSON.stringify(request.headers, null, 2)}
                        </RequestData>
                        <strong>Body:</strong>
                        <RequestData>
                          {formatRequestBody(request.body)}
                        </RequestData>
                      </div>
                      <div>
                        <StatusBadge status={request.status}>
                          {request.status}
                        </StatusBadge>
                      </div>
                    </RequestRow>
                  </div>
                ))}
              </>
            )}
          </RequestsTable>
        </RequestsSection>
      </RequestListenerContainer>
    </StyledCodeEditor>
  );
};

export default RecentActivityContent; 