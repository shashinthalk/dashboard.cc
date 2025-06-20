import React, { useState, useEffect } from 'react';
import { StyledCodeEditor } from './WindowContentWrapper';
import styled from 'styled-components';
import { couldStartTrivia } from 'typescript';
import { useLocalStorageString, useLocalStorageNumber } from '../../shared/hooks/useLocalStorage';

const RequestContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  height: 100%;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: #dcdcdc;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const UrlInput = styled.input`
  background-color: #1a1a1a;
  border: 1px solid #333;
  border-radius: 4px;
  padding: 10px;
  color: #dcdcdc;
  font-family: monospace;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #007acc;
  }
`;

const MethodSelect = styled.select`
  background-color: #1a1a1a;
  border: 1px solid #333;
  border-radius: 4px;
  padding: 8px 12px;
  color: #dcdcdc;
  font-family: monospace;
  font-size: 14px;
  cursor: pointer;
  width: 120px;

  &:focus {
    outline: none;
    border-color: #007acc;
  }
`;

const TextArea = styled.textarea`
  background-color: #1a1a1a;
  border: 1px solid #333;
  border-radius: 4px;
  padding: 10px;
  color: #dcdcdc;
  font-family: monospace;
  font-size: 14px;
  resize: vertical;
  min-height: 100px;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #007acc;
  }
`;

const Button = styled.button`
  background-color: #007acc;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  align-self: flex-start;

  &:hover {
    background-color: #005a9e;
  }

  &:disabled {
    background-color: #555;
    cursor: not-allowed;
  }
`;

const ClearButton = styled.button`
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  align-self: flex-start;

  &:hover {
    background-color: #c82333;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const ResponseArea = styled.div`
  background-color: #1a1a1a;
  border: 1px solid #333;
  border-radius: 4px;
  padding: 10px;
  color: #dcdcdc;
  font-family: monospace;
  font-size: 14px;
  min-height: 150px;
  max-height: 300px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
`;

const StatusBadge = styled.span<{ status: number }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 3px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 10px;
  background-color: ${({ status }) => {
    if (status === 0) return '#6c757d'; // No status
    if (status >= 200 && status < 300) return '#28a745';
    if (status >= 400 && status < 500) return '#dc3545';
    if (status >= 500) return '#fd7e14';
    return '#6c757d';
  }};
  color: white;
`;

const UserHTTPRequestHandler = () => {
  // Use custom localStorage hooks for better state management
  const [url, setUrl, clearUrl] = useLocalStorageString('http-request-url', 'https://jsonplaceholder.typicode.com/posts');
  const [method, setMethod, clearMethod] = useLocalStorageString('http-request-method', 'GET');
  const [requestBody, setRequestBody, clearRequestBody] = useLocalStorageString('http-request-body', '');
  const [response, setResponse, clearResponse] = useLocalStorageString('http-request-response', '');
  const [status, setStatus, clearStatus] = useLocalStorageNumber('http-request-status', 0);
  
  const [isLoading, setIsLoading] = useState(false);

  // Clear all saved data
  const clearAllData = () => {
    setUrl('https://jsonplaceholder.typicode.com/posts');
    setMethod('GET');
    setRequestBody('');
    setResponse('');
    setStatus(0);
  };

  // Clear only response data
  const clearResponseData = () => {
    setResponse('');
    setStatus(0);
  };

  const handleSubmit = async () => {
    if (!url.trim()) {
      setResponse('Error: URL is required');
      return;
    }

    setIsLoading(true);
    setResponse('Loading...');
    setStatus(0);

    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (method !== 'GET' && requestBody.trim()) {
        try {
          options.body = JSON.stringify(JSON.parse(requestBody));
        } catch (e) {
          setResponse('Error: Invalid JSON in request body');
          setIsLoading(false);
          return;
        }
      }

      const response = await fetch(url, options);
      const responseText = await response.text();
      setStatus(response.status);
      setResponse(responseText);
    } catch (error) {
      setResponse(`Error: ${error instanceof Error ? error.message : 'Request failed'}`);
      setStatus(0);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StyledCodeEditor>
      <RequestContainer>
        <InputGroup>
          <Label>URL</Label>
          <UrlInput
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://api.example.com/endpoint"
          />
        </InputGroup>

        <InputGroup>
          <Label>Method</Label>
          <MethodSelect value={method} onChange={(e) => setMethod(e.target.value)}>
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="PATCH">PATCH</option>
            <option value="DELETE">DELETE</option>
          </MethodSelect>
        </InputGroup>

        {method !== 'GET' && (
          <InputGroup>
            <Label>Request Body (JSON)</Label>
            <TextArea
              value={requestBody}
              onChange={(e) => setRequestBody(e.target.value)}
              placeholder='{"key": "value"}'
            />
          </InputGroup>
        )}

        <ButtonGroup>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send Request'}
          </Button>
          <ClearButton onClick={clearAllData}>Clear All Data</ClearButton>
          <ClearButton onClick={clearResponseData}>Clear Response</ClearButton>
        </ButtonGroup>

        <InputGroup>
          <Label>Response</Label>
          {status !== 0 && <StatusBadge status={status}>Status: {status}</StatusBadge>}
          <ResponseArea>{response}</ResponseArea>
        </InputGroup>
      </RequestContainer>
    </StyledCodeEditor>
  );
};

export default UserHTTPRequestHandler; 