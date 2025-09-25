import styled from '@emotion/styled';
import { theme } from '../styles/theme';
import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const InputWrapper = styled.div<{ fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  ${({ fullWidth }) => fullWidth && 'width: 100%;'}
`;

const Label = styled.label`
  font-weight: 500;
  color: ${theme.colors.gray[700]};
  font-size: 0.875rem;
`;

const StyledInput = styled.input<{ hasError?: boolean }>`
  padding: ${theme.spacing.md};
  border: 1px solid ${({ hasError }) => hasError ? theme.colors.danger : theme.colors.gray[300]};
  border-radius: ${theme.borderRadius.md};
  font-size: 1rem;
  transition: border-color 0.2s ease-in-out;
  background-color: ${theme.colors.white};

  &:focus {
    outline: none;
    border-color: ${({ hasError }) => hasError ? theme.colors.danger : theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ hasError }) => 
      hasError ? 'rgba(220, 53, 69, 0.1)' : 'rgba(102, 126, 234, 0.1)'};
  }

  &::placeholder {
    color: ${theme.colors.gray[500]};
  }

  &:disabled {
    background-color: ${theme.colors.gray[100]};
    cursor: not-allowed;
  }
`;

const ErrorText = styled.span`
  color: ${theme.colors.danger};
  font-size: 0.875rem;
  margin-top: ${theme.spacing.xs};
`;

export const Input = React.memo<InputProps>(({ 
  label, 
  error, 
  fullWidth = false, 
  ...props 
}) => {
  return (
    <InputWrapper fullWidth={fullWidth}>
      {label && <Label htmlFor={props.id}>{label}</Label>}
      <StyledInput hasError={!!error} {...props} />
      {error && <ErrorText>{error}</ErrorText>}
    </InputWrapper>
  );
});