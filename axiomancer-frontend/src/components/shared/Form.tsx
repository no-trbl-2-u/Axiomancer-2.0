import styled from '@emotion/styled';
import { theme } from '@styles/theme';

export const Form = styled.form<{
  variant?: 'default' | 'inline' | 'grid';
  gap?: 'sm' | 'md' | 'lg';
}>`
  display: flex;
  flex-direction: column;
  
  gap: ${props => {
    switch (props.gap) {
      case 'sm': return theme.spacing.sm;
      case 'md': return theme.spacing.md;
      case 'lg': return theme.spacing.lg;
      default: return theme.spacing.lg;
    }
  }};
  
  ${props => {
    if (props.variant === 'grid') {
      return `
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        
        @media (max-width: 768px) {
          grid-template-columns: 1fr;
        }
      `;
    }
    if (props.variant === 'inline') {
      return `
        flex-direction: row;
        align-items: center;
        
        @media (max-width: 768px) {
          flex-direction: column;
        }
      `;
    }
    return '';
  }}
`;

export const FormContainer = styled.div<{
  variant?: 'default' | 'auth' | 'modal';
  maxWidth?: string;
}>`
  ${props => {
    switch (props.variant) {
      case 'auth':
        return `
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: ${theme.borderRadius.xl};
          padding: ${theme.spacing.xxl};
          box-shadow: ${theme.shadows.xl};
          width: 90%;
          max-width: ${props.maxWidth || '500px'};
          
          @media (max-width: 768px) {
            width: 85%;
            max-width: 450px;
            padding: ${theme.spacing.xl};
          }
          
          @media (max-width: 480px) {
            width: 90%;
            max-width: 380px;
            padding: ${theme.spacing.lg};
          }
        `;
      case 'modal':
        return `
          padding: ${theme.spacing.lg};
          width: 100%;
          max-width: ${props.maxWidth || '600px'};
        `;
      default:
        return `
          width: 100%;
          max-width: ${props.maxWidth || '100%'};
        `;
    }
  }}
`;

export const FormGroup = styled.div<{
  inline?: boolean;
  gap?: 'xs' | 'sm' | 'md' | 'lg';
}>`
  display: flex;
  flex-direction: ${props => props.inline ? 'row' : 'column'};
  
  gap: ${props => {
    switch (props.gap) {
      case 'xs': return theme.spacing.xs;
      case 'sm': return theme.spacing.sm;
      case 'md': return theme.spacing.md;
      case 'lg': return theme.spacing.lg;
      default: return theme.spacing.sm;
    }
  }};
  
  ${props => props.inline ? `
    align-items: center;
    
    @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
    }
  ` : ''}
`;

export const FormActions = styled.div<{
  align?: 'left' | 'center' | 'right' | 'space-between';
  gap?: 'sm' | 'md' | 'lg';
}>`
  display: flex;
  gap: ${props => {
    switch (props.gap) {
      case 'sm': return theme.spacing.sm;
      case 'md': return theme.spacing.md;
      case 'lg': return theme.spacing.lg;
      default: return theme.spacing.md;
    }
  }};
  
  ${props => {
    switch (props.align) {
      case 'center':
        return 'justify-content: center;';
      case 'right':
        return 'justify-content: flex-end;';
      case 'space-between':
        return 'justify-content: space-between;';
      default:
        return '';
    }
  }}
  
  margin-top: ${theme.spacing.md};
  
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    
    button {
      width: 100%;
    }
  }
`;

export const FormError = styled.div`
  background-color: ${theme.colors.danger};
  color: ${theme.colors.white};
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  text-align: center;
  font-size: 0.875rem;
  margin-bottom: ${theme.spacing.md};
`;

export const FormSuccess = styled.div`
  background-color: ${theme.colors.success};
  color: ${theme.colors.white};
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  text-align: center;
  font-size: 0.875rem;
  margin-bottom: ${theme.spacing.md};
`;

export const FormHelperText = styled.span`
  color: ${theme.colors.text.muted};
  font-size: 0.75rem;
  margin-top: ${theme.spacing.xs};
`;

export const FormLabel = styled.label<{
  required?: boolean;
}>`
  font-weight: 500;
  color: ${theme.colors.gray[700]};
  font-size: 0.875rem;
  margin-bottom: ${theme.spacing.xs};
  display: block;
  
  ${props => props.required ? `
    &::after {
      content: ' *';
      color: ${theme.colors.danger};
    }
  ` : ''}
`;
