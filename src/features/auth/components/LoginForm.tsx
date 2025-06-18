import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../../styles/theme';
import { useAuth } from '../context/AuthContext';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${theme.colors.surface};
  padding: ${theme.spacing.lg};
`;

const LoginCard = styled.div`
  width: 100%;
  max-width: 400px;
  background-color: ${theme.colors.background};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.xl};
  box-shadow: ${theme.shadows.card};
`;

const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing.xl};
`;

const LoginTitle = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing.sm} 0;
`;

const LoginSubtitle = styled.p`
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.text.secondary};
  margin: 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const Label = styled.label`
  font-size: ${theme.typography.sizes.sm};
  font-weight: 500;
  color: ${theme.colors.text.primary};
`;

const Input = styled.input`
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  background-color: ${theme.colors.background};
  color: ${theme.colors.text.primary};
  font-size: ${theme.typography.sizes.sm};
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${theme.colors.mac.green};
  }

  &::placeholder {
    color: ${theme.colors.text.secondary};
  }
`;

const LoginButton = styled.button<{ isLoading: boolean }>`
  padding: ${theme.spacing.md};
  background-color: ${props => props.isLoading ? theme.colors.border : theme.colors.surface};
  color: ${theme.colors.text.primary};
  border: none;
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.typography.sizes.sm};
  font-weight: 500;
  cursor: ${props => props.isLoading ? 'not-allowed' : 'pointer'};
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};

  &:hover:not(:disabled) {
    background-color: ${props => props.isLoading ? theme.colors.border : '#1f9d55'};
  }

  &:disabled {
    opacity: 0.6;
  }
`;

const ErrorMessage = styled.div`
  padding: ${theme.spacing.md};
  background-color: rgba(255, 95, 87, 0.1);
  border: 1px solid ${theme.colors.mac.red};
  border-radius: ${theme.borderRadius.sm};
  color: ${theme.colors.mac.red};
  font-size: ${theme.typography.sizes.sm};
  text-align: center;
`;

const DemoCredentials = styled.div`
  margin-top: ${theme.spacing.lg};
  padding: ${theme.spacing.md};
  background-color: ${theme.colors.background};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
`;

const DemoTitle = styled.h3`
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing.sm} 0;
`;

const DemoText = styled.p`
  font-size: ${theme.typography.sizes.xs};
  color: ${theme.colors.text.secondary};
  margin: 0;
  line-height: 1.4;
`;

const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid ${theme.colors.text.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const LoginForm: React.FC = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const { login } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentials.email || !credentials.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const success = await login(credentials.email, credentials.password);
      
      if (!success) {
        setError('Invalid email or password');
      }
      // If successful, the AuthContext will automatically update isAuthenticated
      // and the App component will re-render to show the dashboard
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <LoginHeader>
          <LoginTitle>Welcome Back</LoginTitle>
          <LoginSubtitle>Sign in to shashinthalk Dashboard</LoginSubtitle>
        </LoginHeader>

        <Form onSubmit={handleSubmit}>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              disabled={isLoading}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              disabled={isLoading}
              required
            />
          </FormGroup>

          <LoginButton type="submit" isLoading={isLoading} disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </LoginButton>
        </Form>
      </LoginCard>
    </LoginContainer>
  );
}; 