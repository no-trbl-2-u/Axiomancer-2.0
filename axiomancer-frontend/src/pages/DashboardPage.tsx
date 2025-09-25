import React from 'react';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';
import { useAuth } from '../contexts/AuthContext';

const DashboardContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xxl};
  box-shadow: ${theme.shadows.xl};
  width: 100%;
  max-width: 800px;
  text-align: center;
`;

const Title = styled.h1`
  color: ${theme.colors.gray[800]};
  margin-bottom: ${theme.spacing.lg};
  font-size: 2.5rem;
`;

const Subtitle = styled.p`
  color: ${theme.colors.gray[600]};
  font-size: 1.125rem;
  margin-bottom: ${theme.spacing.xl};
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing.lg};
  margin-top: ${theme.spacing.xl};
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.8);
  padding: ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.md};
  box-shadow: ${theme.shadows.sm};
  border: 1px solid rgba(102, 126, 234, 0.1);

  h3 {
    color: ${theme.colors.primary};
    margin-bottom: ${theme.spacing.md};
    font-size: 1.25rem;
  }

  p {
    color: ${theme.colors.gray[700]};
    line-height: 1.5;
  }
`;

export const DashboardPage = React.memo(() => {
  const { user } = useAuth();

  return (
    <DashboardContainer>
      <Title>Welcome to Axiomancer 2.0</Title>
      <Subtitle>
        Hello {user?.firstName}! You're successfully logged into the platform.
      </Subtitle>
      
      <FeatureGrid>
        <FeatureCard>
          <h3>Analytics Dashboard</h3>
          <p>
            View comprehensive analytics and insights with real-time data visualization
            and interactive charts.
          </p>
        </FeatureCard>
        
        <FeatureCard>
          <h3>Data Management</h3>
          <p>
            Efficiently manage your data sources with our robust database integration
            and automated processing pipelines.
          </p>
        </FeatureCard>
        
        <FeatureCard>
          <h3>Reporting Tools</h3>
          <p>
            Generate detailed reports with customizable templates and automated
            scheduling for stakeholder updates.
          </p>
        </FeatureCard>
        
        <FeatureCard>
          <h3>API Integration</h3>
          <p>
            Seamlessly integrate with third-party services through our secure
            REST API with JWT authentication.
          </p>
        </FeatureCard>
      </FeatureGrid>
    </DashboardContainer>
  );
});