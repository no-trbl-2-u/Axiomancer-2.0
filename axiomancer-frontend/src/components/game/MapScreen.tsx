import React, { useState } from 'react';
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
  position: relative;
`;

const MapTitle = styled.h2`
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.xl};
  font-size: 2rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
`;

const MapViewContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.xl};
  max-width: 1200px;
  width: 100%;
`;

const MapImageContainer = styled.div`
  flex: 2;
  position: relative;
  background: ${theme.colors.background.panel};
  border: 3px solid ${theme.colors.border.primary};
  border-radius: ${theme.rpg.panelBorderRadius};
  overflow: hidden;
  aspect-ratio: 16/10;
  min-height: 400px;
  box-shadow: ${theme.shadows.panel};
`;

const MapImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.8;
`;

const LocationMarker = styled.div<{ x: number; y: number; current: boolean; visited: boolean }>`
  position: absolute;
  left: ${props => props.x * 33.33}%;
  top: ${props => props.y * 33.33}%;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.current
    ? 'radial-gradient(circle, #fbbf24, #f59e0b)'
    : props.visited
    ? 'radial-gradient(circle, #3b82f6, #1d4ed8)'
    : 'radial-gradient(circle, #6b7280, #374151)'};
  border: 3px solid ${props => props.current
    ? '#ffffff'
    : props.visited
    ? '#e5e7eb'
    : '#9ca3af'};
  cursor: ${props => props.visited ? 'pointer' : 'default'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: white;
  transform: translate(-50%, -50%);
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  z-index: 10;

  &:hover {
    ${props => props.visited && !props.current && `
      transform: translate(-50%, -50%) scale(1.1);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.6);
    `}
  }

  &::after {
    content: '';
    position: absolute;
    width: 60px;
    height: 60px;
    border: 2px solid ${props => props.current ? '#fbbf24' : props.visited ? '#3b82f6' : '#6b7280'};
    border-radius: 50%;
    animation: ${props => props.current ? 'pulse 2s infinite' : 'none'};
    opacity: 0.6;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
  }

  @keyframes pulse {
    0% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
    50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.3; }
    100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
  }
`;

const LocationPanel = styled.div`
  flex: 1;
  background: ${theme.colors.background.panel};
  border: 3px solid ${theme.colors.border.primary};
  border-radius: ${theme.rpg.panelBorderRadius};
  padding: ${theme.spacing.xl};
  box-shadow: ${theme.shadows.panel};
  max-height: 500px;
  overflow-y: auto;
`;

const LocationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const LocationItem = styled.div<{ current: boolean; visited: boolean }>`
  background: ${props => props.current
    ? 'linear-gradient(45deg, rgba(102, 126, 234, 0.3), rgba(139, 92, 246, 0.3))'
    : props.visited
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(0, 0, 0, 0.3)'};
  border: 2px solid ${props => props.current
    ? theme.colors.primary
    : props.visited
    ? 'rgba(255, 255, 255, 0.2)'
    : 'rgba(255, 255, 255, 0.1)'};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md};
  cursor: ${props => props.visited && !props.current ? 'pointer' : 'default'};
  transition: all 0.2s ease;

  &:hover {
    ${props => props.visited && !props.current && `
      background: rgba(255, 255, 255, 0.1);
      border-color: ${theme.colors.primary};
    `}
  }

  h4 {
    margin: 0 0 ${theme.spacing.xs} 0;
    color: ${props => props.current ? theme.colors.text.accent : theme.colors.text.primary};
    font-size: 1.1rem;
    font-weight: bold;
  }

  p {
    margin: 0;
    color: ${theme.colors.text.secondary};
    font-size: 0.9rem;
    line-height: 1.3;
  }

  .location-type {
    display: inline-block;
    background: ${props => props.current ? theme.colors.primary : 'rgba(255, 255, 255, 0.1)'};
    color: white;
    padding: 2px 8px;
    border-radius: ${theme.borderRadius.sm};
    font-size: 0.7rem;
    font-weight: bold;
    text-transform: uppercase;
    margin-top: ${theme.spacing.xs};
  }
`;

const MapModeToggle = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.lg};
`;

const ModeButton = styled.button<{ active: boolean }>`
  background: ${props => props.active ? theme.colors.primary : theme.colors.background.secondary};
  border: 2px solid ${props => props.active ? theme.colors.primary : theme.colors.border.dark};
  color: ${props => props.active ? 'white' : theme.colors.text.secondary};
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  border-radius: ${theme.rpg.buttonBorderRadius};
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: bold;
  text-transform: uppercase;

  &:hover {
    border-color: ${theme.colors.primary};
    color: ${theme.colors.text.accent};
  }
`;

export const MapScreen = React.memo(() => {
  const { gameState, moveToLocation } = useGame();
  const { locations, currentLocation } = gameState;
  const [viewMode, setViewMode] = useState<'visual' | 'list'>('visual');
  const [selectedLocation, setSelectedLocation] = useState<string>(currentLocation);

  // Get current map image based on selected location
  const currentMapImage = locations[selectedLocation]?.mapImage || '/maps/map01.jpeg';

  // Location type icons
  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'town': return '🏘️';
      case 'forest': return '🌲';
      case 'cave': return '🕳️';
      case 'city': return '🏛️';
      case 'island': return '🏝️';
      case 'river': return '🌊';
      default: return '📍';
    }
  };

  const handleLocationClick = (locationId: string) => {
    const isVisited = true; // TODO: Track visited locations properly
    const isCurrent = currentLocation === locationId;
    
    if (isVisited && !isCurrent) {
      moveToLocation(locationId);
    }
    setSelectedLocation(locationId);
  };

  return (
    <MapContainer>
      <MapTitle>World Map</MapTitle>
      
      <MapModeToggle>
        <ModeButton 
          active={viewMode === 'visual'} 
          onClick={() => setViewMode('visual')}
        >
          Visual Map
        </ModeButton>
        <ModeButton 
          active={viewMode === 'list'} 
          onClick={() => setViewMode('list')}
        >
          Location List
        </ModeButton>
      </MapModeToggle>

      {viewMode === 'visual' ? (
        <MapViewContainer>
          <MapImageContainer>
            <MapImage src={currentMapImage} alt="World Map" />
            {Object.values(locations).map(location => {
              if (!location.coordinates) return null;
              
              const isCurrent = currentLocation === location.id;
              const isVisited = true; // TODO: Track visited locations
              
              return (
                <LocationMarker
                  key={location.id}
                  x={location.coordinates.x}
                  y={location.coordinates.y}
                  current={isCurrent}
                  visited={isVisited}
                  onClick={() => handleLocationClick(location.id)}
                  title={location.name}
                >
                  {getLocationIcon(location.type)}
                </LocationMarker>
              );
            })}
          </MapImageContainer>

          <LocationPanel>
            <h3 style={{ color: theme.colors.text.accent, marginTop: 0 }}>
              {locations[selectedLocation]?.name || 'Unknown Location'}
            </h3>
            <p style={{ color: theme.colors.text.secondary, marginBottom: theme.spacing.lg }}>
              {locations[selectedLocation]?.description}
            </p>
            
            <div style={{ marginBottom: theme.spacing.md }}>
              <div className="location-type" style={{
                background: theme.colors.primary,
                color: 'white',
                padding: '4px 12px',
                borderRadius: theme.borderRadius.sm,
                fontSize: '0.8rem',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                display: 'inline-block'
              }}>
                {locations[selectedLocation]?.type}
              </div>
            </div>

            {locations[selectedLocation]?.resources && locations[selectedLocation].resources.length > 0 && (
              <div style={{ marginBottom: theme.spacing.md }}>
                <h4 style={{ color: theme.colors.text.accent, fontSize: '1rem', marginBottom: theme.spacing.xs }}>
                  Resources:
                </h4>
                <p style={{ color: theme.colors.text.secondary, fontSize: '0.9rem' }}>
                  {locations[selectedLocation].resources.join(', ')}
                </p>
              </div>
            )}

            {locations[selectedLocation]?.connections && locations[selectedLocation].connections.length > 0 && (
              <div>
                <h4 style={{ color: theme.colors.text.accent, fontSize: '1rem', marginBottom: theme.spacing.xs }}>
                  Connected to:
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: theme.spacing.xs }}>
                  {locations[selectedLocation].connections.map(connectionId => (
                    <span
                      key={connectionId}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: theme.colors.text.secondary,
                        padding: '2px 8px',
                        borderRadius: theme.borderRadius.sm,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        border: `1px solid ${theme.colors.border.dark}`,
                        transition: 'all 0.2s ease'
                      }}
                      onClick={() => setSelectedLocation(connectionId)}
                    >
                      {locations[connectionId]?.name || connectionId}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </LocationPanel>
        </MapViewContainer>
      ) : (
        <LocationPanel style={{ maxWidth: '800px', margin: '0 auto' }}>
          <LocationList>
            {Object.values(locations).map(location => {
              const isCurrent = currentLocation === location.id;
              const isVisited = true; // TODO: Track visited locations

              return (
                <LocationItem
                  key={location.id}
                  current={isCurrent}
                  visited={isVisited}
                  onClick={() => handleLocationClick(location.id)}
                >
                  <h4>
                    {getLocationIcon(location.type)} {location.name}
                    {isCurrent && ' (Current)'}
                  </h4>
                  <p>{location.description}</p>
                  <div className="location-type">{location.type}</div>
                </LocationItem>
              );
            })}
          </LocationList>
        </LocationPanel>
      )}
    </MapContainer>
  );
});