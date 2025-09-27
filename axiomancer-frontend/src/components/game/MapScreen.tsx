import React from 'react';
import styled from '@emotion/styled';
import { theme } from '../../styles/theme';
import { useGame } from '../../contexts/GameContext';

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px ${theme.spacing.xl} 80px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
`;

const MapTitle = styled.h2`
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.xl};
  font-size: 2rem;
`;

const MapGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 200px);
  gap: ${theme.spacing.lg};
  max-width: 800px;
`;

const LocationNode = styled.div<{ current: boolean; visited: boolean }>`
  background: ${props => props.current
    ? 'linear-gradient(45deg, rgba(102, 126, 234, 0.8), rgba(139, 92, 246, 0.8))'
    : props.visited
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.5)'};
  border: 2px solid ${props => props.current
    ? theme.colors.primary
    : props.visited
    ? 'rgba(255, 255, 255, 0.3)'
    : 'rgba(255, 255, 255, 0.1)'};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  text-align: center;
  color: white;
  cursor: ${props => props.visited ? 'pointer' : 'default'};
  transition: all 0.2s ease;

  &:hover {
    ${props => props.visited && !props.current && `
      background: rgba(255, 255, 255, 0.15);
      border-color: ${theme.colors.primary};
    `}
  }

  h3 {
    margin: 0 0 ${theme.spacing.sm} 0;
    font-size: 1.1rem;
    color: ${props => props.current ? 'white' : props.visited ? theme.colors.primary : 'rgba(255, 255, 255, 0.6)'};
  }

  p {
    margin: 0;
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.3;
  }
`;

export const MapScreen = React.memo(() => {
  const { gameState, moveToLocation } = useGame();
  const { locations, currentLocation } = gameState;

  // Simple layout for the initial locations
  const locationLayout = [
    ['', 'cave', ''],
    ['', 'forest', ''],
    ['fishing_town', '', ''],
  ];

  return (
    <MapContainer>
      <MapTitle>World Map</MapTitle>
      <MapGrid>
        {locationLayout.flat().map((locationId, index) => {
          if (!locationId) {
            return <div key={index} />;
          }

          const location = locations[locationId];
          if (!location) {
            return <div key={index} />;
          }

          const isCurrent = currentLocation === locationId;
          const isVisited = true; // TODO: Track visited locations

          return (
            <LocationNode
              key={locationId}
              current={isCurrent}
              visited={isVisited}
              onClick={() => isVisited && !isCurrent && moveToLocation(locationId)}
            >
              <h3>{location.name}</h3>
              <p>{location.type}</p>
            </LocationNode>
          );
        })}
      </MapGrid>
    </MapContainer>
  );
});