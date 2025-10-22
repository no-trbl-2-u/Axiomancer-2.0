import React from 'react';
import styled from '@emotion/styled';

interface LayoutProps {
  children: React.ReactNode;
}

const LayoutContainer = styled.div`
  min-height: 80vh;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const Layout = React.memo<LayoutProps>(({ children }) => {
  return (
    <LayoutContainer>
      <Main>{children}</Main>
    </LayoutContainer>
  );
});