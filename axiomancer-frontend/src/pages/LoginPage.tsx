import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { Input } from '../components/shared/Input';
import { FormContainer, Form, FormError } from '../components/shared/Form';
import { Title } from '../components/shared/Text';
import { ActionButton } from '../components/shared/ActionButton';
import { StyledLink } from '../components/shared/Link';
import { LoginCredentials } from '../types';

export const LoginPage = React.memo(() => {
  // Zustand store
  const login = useAuthStore(state => state.login);
  const isLoading = useAuthStore(state => state.isLoading);
  
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
    <FormContainer variant="auth">
      <Title variant="page" size="lg">Welcome Back</Title>
      {error && <FormError>{error}</FormError>}
      <Form variant="default" gap="lg" onSubmit={handleSubmit}>
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
        <ActionButton
          type="submit"
          variant="primary"
          size="md"
          fullWidth
          disabled={isLoading}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </ActionButton>
        <StyledLink to="/register" variant="underline">
          Don&apos;t have an account? Sign up
        </StyledLink>
      </Form>
    </FormContainer>
  );
});