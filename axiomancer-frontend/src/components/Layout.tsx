import styled from '@emotion/styled';
import { theme } from '../styles/theme';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './Button';
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: ${theme.spacing.md} ${theme.spacing.xl};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.h1`
  color: ${theme.colors.white};
  font-size: 1.5rem;
  font-weight: 700;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  color: ${theme.colors.white};
`;

const Main = styled.main`
  flex: 1;
  padding: ${theme.spacing.xl};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const Layout = React.memo<LayoutProps>(({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <LayoutContainer>
      <Header>
        <Logo>Axiomancer 2.0</Logo>
        {isAuthenticated && user && (
          <UserInfo>
            <span>Welcome, {user.firstName}!</span>
            <Button variant="outline" size="sm" onClick={logout}>
              Logout
            </Button>
          </UserInfo>
        )}
      </Header>
      <Main>{children}</Main>
    </LayoutContainer>
  );
});