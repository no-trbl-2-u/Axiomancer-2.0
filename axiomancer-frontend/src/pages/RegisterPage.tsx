import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { theme } from '../styles/theme';
import { RegisterData } from '../types';

const RegisterContainer = styled.div`
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

interface RegisterPageProps {
  onSwitchToLogin: () => void;
}

export const RegisterPage = React.memo<RegisterPageProps>(({ onSwitchToLogin }) => {
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError('');

    try {
      await register(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <RegisterContainer>
      <Title>Create Account</Title>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="firstName"
          label="First Name"
          placeholder="Enter your first name"
          value={formData.firstName}
          onChange={handleChange}
          required
          fullWidth
        />
        <Input
          type="text"
          name="lastName"
          label="Last Name"
          placeholder="Enter your last name"
          value={formData.lastName}
          onChange={handleChange}
          required
          fullWidth
        />
        <Input
          type="email"
          name="email"
          label="Email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
          fullWidth
        />
        <Input
          type="password"
          name="password"
          label="Password"
          placeholder="Create a password"
          value={formData.password}
          onChange={handleChange}
          required
          fullWidth
        />
        <Button
          type="submit"
          fullWidth
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>
        <LinkButton type="button" onClick={onSwitchToLogin}>
          Already have an account? Sign in
        </LinkButton>
      </Form>
    </RegisterContainer>
  );
});