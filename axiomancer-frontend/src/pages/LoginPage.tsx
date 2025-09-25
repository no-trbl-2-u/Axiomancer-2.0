import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { theme } from '../styles/theme';
import { LoginCredentials } from '../types';

const LoginContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xxl};
  box-shadow: ${theme.shadows.xl};
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: ${theme.spacing.xl};
  color: ${theme.colors.gray[800]};
  font-size: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const ErrorMessage = styled.div`
  background-color: ${theme.colors.danger};
  color: ${theme.colors.white};
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  text-align: center;
  font-size: 0.875rem;
`;

const LinkButton = styled.button`
  background: none;
  color: ${theme.colors.primary};
  text-decoration: underline;
  font-size: 0.875rem;
  text-align: center;
  margin-top: ${theme.spacing.md};
  
  &:hover {
    color: ${theme.colors.secondary};
  }
`;

interface LoginPageProps {
  onSwitchToRegister: () => void;
}

export const LoginPage = React.memo<LoginPageProps>(({ onSwitchToRegister }) => {
  const { login, isLoading } = useAuth();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError('');

    try {
      await login(credentials);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  return (
    <LoginContainer>
      <Title>Welcome Back</Title>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Form onSubmit={handleSubmit}>
        <Input
          type="email"
          name="email"
          label="Email"
          placeholder="Enter your email"
          value={credentials.email}
          onChange={handleChange}
          required
          fullWidth
        />
        <Input
          type="password"
          name="password"
          label="Password"
          placeholder="Enter your password"
          value={credentials.password}
          onChange={handleChange}
          required
          fullWidth
        />
        <Button
          type="submit"
          fullWidth
          disabled={isLoading}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>
        <LinkButton type="button" onClick={onSwitchToRegister}>
          Don't have an account? Sign up
        </LinkButton>
      </Form>
    </LoginContainer>
  );
});