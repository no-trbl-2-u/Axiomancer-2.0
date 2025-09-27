import React from 'react';
import styled from '@emotion/styled';

const LandingContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: #1C1C1C;
`;

const BackgroundImage = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /* Display at a static size based on viewport height */
  height: min(80vh, 600px);
  width: auto;
  object-fit: contain;
  object-position: center;
  z-index: 0;
  max-width: 90vw;
  
  /* Responsive sizing */
  @media (max-width: 768px) {
    height: min(70vh, 500px);
    max-width: 95vw;
  }
  
  @media (max-width: 480px) {
    height: min(60vh, 400px);
    max-width: 98vw;
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  z-index: 1;
`;

const ClickToStartText = styled.div`
  position: absolute;
  bottom: 30%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  text-align: center;
  color: #f8f9fa;
  font-family: 'serif';
  font-size: 2.5rem;
  font-weight: bold;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.8);
  letter-spacing: 2px;
  text-transform: uppercase;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateX(-50%) scale(1.05);
    text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.9);
    color: #dc143c;
  }

  @media (max-width: 768px) {
    font-size: 2rem;
    bottom: 25%;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
    bottom: 20%;
  }
`;

interface LandingPageProps {
  onClickToStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onClickToStart }) => {
  return (
    <LandingContainer onClick={onClickToStart}>
      <BackgroundImage 
        src="/click-to-start.png" 
        alt="Axiomancer" 
        draggable={false}
      />
      <Overlay />
      <ClickToStartText>
        Click to Start
      </ClickToStartText>
    </LandingContainer>
  );
};