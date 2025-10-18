import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Input } from '../components/Input';
import { FormContainer, Form, FormError } from '../components/shared/Form';
import { Title } from '../components/shared/Text';
import { ActionButton } from '../components/shared/ActionButton';
import { StyledLink } from '../components/shared/Link';
import { RegisterData } from '../types';
import { hasExistingCharacter } from '../utils/characterSave';

export const RegisterPage = React.memo(() => {
  // Zustand store
  const register = useAuthStore(state => state.register);
  const isLoading = useAuthStore(state => state.isLoading);
  
  const navigate = useNavigate();
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
      // After successful registration, redirect based on existing character
      const hasChar = await hasExistingCharacter();
      if (hasChar) {
        navigate('/character-selection');
      } else {
        navigate('/character-creation');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <FormContainer variant="auth" maxWidth="400px">
      <Title variant="page" size="lg">Create Account</Title>
      {error && <FormError>{error}</FormError>}
      <Form variant="default" gap="lg" onSubmit={handleSubmit}>
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
        <ActionButton
          type="submit"
          variant="primary"
          size="md"
          fullWidth
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </ActionButton>
        <StyledLink to="/login" variant="underline">
          Already have an account? Sign in
        </StyledLink>
      </Form>
    </FormContainer>
  );
});