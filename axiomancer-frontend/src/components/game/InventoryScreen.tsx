import React from 'react';
import styled from '@emotion/styled';
import { theme } from '../../styles/theme';

const InventoryContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #581c87 0%, #7c3aed 50%, #581c87 100%);
  color: white;
  text-align: center;
`;

export const InventoryScreen = React.memo(() => {
  return (
    <InventoryContainer>
      <div>
        <h2>Inventory System</h2>
        <p>Equipment and items coming soon...</p>
      </div>
    </InventoryContainer>
  );
});