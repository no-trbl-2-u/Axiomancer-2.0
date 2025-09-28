import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { theme } from '../../styles/theme';
import { useGame } from '../../contexts/GameContext';
import { loadAvailablePortraits, getFallbackPortraits, Portrait } from '../../utils/portraitLoader';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%);
  padding: ${theme.spacing.lg};
`;

const CreationContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.xl};
  max-width: 1000px;
  width: 100%;
`;

const LeftSquare = styled.div`
  flex: 1;
  background: ${theme.colors.background.panel};
  border: 2px solid ${theme.colors.border.primary};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};

  h2 {
    color: ${theme.colors.text.accent};
    margin: 0 0 ${theme.spacing.lg} 0;
    text-align: center;
    font-size: 1.5rem;
  }
`;

const RightSquare = styled.div`
  flex: 1;
  background: ${theme.colors.background.panel};
  border: 2px solid ${theme.colors.border.primary};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xl};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.lg};

  h2 {
    color: ${theme.colors.text.accent};
    margin: 0;
    text-align: center;
    font-size: 1.5rem;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;

  label {
    color: ${theme.colors.text.primary};
    font-weight: 600;
    margin-bottom: ${theme.spacing.sm};
  }

  input, select {
    padding: ${theme.spacing.md};
    border: 2px solid ${theme.colors.border.secondary};
    border-radius: ${theme.borderRadius.md};
    background: ${theme.colors.background.secondary};
    color: ${theme.colors.text.primary};
    font-size: 1rem;

    &:focus {
      outline: none;
      border-color: ${theme.colors.primary};
    }
  }
`;

const PortraitDisplay = styled.div`
  img {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    border: 3px solid ${theme.colors.border.primary};
    object-fit: cover;
  }

  .placeholder {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    border: 3px dashed ${theme.colors.border.secondary};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${theme.colors.text.secondary};
    font-style: italic;
  }
`;

const StatsContainer = styled.div`
  width: 100%;
  color: ${theme.colors.text.primary};

  .age-hp-mp {
    text-align: center;
    margin-bottom: ${theme.spacing.lg};
    font-size: 1.1rem;
    font-weight: 600;
  }

  .stat-group {
    margin-bottom: ${theme.spacing.md};

    .group-title {
      color: ${theme.colors.text.accent};
      font-weight: 600;
      margin-bottom: ${theme.spacing.sm};
      border-bottom: 1px solid ${theme.colors.border.secondary};
      padding-bottom: ${theme.spacing.xs};
    }

    .stat-line {
      display: flex;
      justify-content: space-between;
      margin-bottom: ${theme.spacing.xs};
      font-size: 0.9rem;

      .stat-name {
        color: ${theme.colors.text.secondary};
      }

      .stat-value {
        color: ${theme.colors.text.primary};
        font-weight: 600;
      }
    }
  }

  .derived-stats {
    margin-top: ${theme.spacing.lg};
    padding-top: ${theme.spacing.md};
    border-top: 2px solid ${theme.colors.border.secondary};

    .derived-title {
      color: ${theme.colors.text.accent};
      font-weight: 600;
      margin-bottom: ${theme.spacing.sm};
      text-align: center;
    }
  }
`;

const CreateButton = styled.button`
  background: ${theme.colors.primary};
  color: white;
  border: none;
  padding: ${theme.spacing.md} ${theme.spacing.xl};
  border-radius: ${theme.borderRadius.md};
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  transition: all 0.3s ease;
  margin-top: auto;

  &:hover {
    background: ${theme.colors.accent};
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

export const CharacterCreationScreen: React.FC = () => {
  console.log('NEW CHARACTER CREATION SCREEN LOADED - TWO SQUARE LAYOUT');
  const { createCharacter } = useGame();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [selectedPortrait, setSelectedPortrait] = useState('');
  const [portraits, setPortraits] = useState<{male: Portrait[], female: Portrait[]}>({ male: [], female: [] });
  const [portraitsLoading, setPortraitsLoading] = useState(true);

  // Load available portraits dynamically
  useEffect(() => {
    const loadPortraits = async () => {
      try {
        const availablePortraits = await loadAvailablePortraits();
        if (availablePortraits.male.length > 0 || availablePortraits.female.length > 0) {
          setPortraits(availablePortraits);
        } else {
          // Fallback to hardcoded portraits if none found
          setPortraits(getFallbackPortraits());
        }
      } catch (error) {
        console.error('Failed to load portraits, using fallback:', error);
        setPortraits(getFallbackPortraits());
      } finally {
        setPortraitsLoading(false);
      }
    };

    loadPortraits();
  }, []);

  const availablePortraits = portraits[gender] || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && selectedPortrait) {
      createCharacter({
        name: name.trim(),
        gender,
        portrait: {
          imageUrl: selectedPortrait,
          description: `${gender} character portrait`
        }
      });
      navigate('/game');
    }
  };

  const canSubmit = name.trim() && selectedPortrait;

  // Starting stats
  const bodyScore = 5;
  const mindScore = 5;
  const heartScore = 5;

  return (
    <Container>
      <CreationContainer>
        <LeftSquare>
          <h2>Character Creation - UPDATED {new Date().toLocaleTimeString()}</h2>

          <FormGroup>
            <label htmlFor="name">Enter Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Character name"
              autoFocus
            />
          </FormGroup>

          <FormGroup>
            <label htmlFor="gender">Enter Gender</label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value as 'male' | 'female')}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </FormGroup>

          <FormGroup>
            <label htmlFor="portrait">Portrait Dropdown</label>
            <select
              id="portrait"
              value={selectedPortrait}
              onChange={(e) => setSelectedPortrait(e.target.value)}
              disabled={portraitsLoading}
            >
              <option value="">
                {portraitsLoading ? 'Loading portraits...' : 'Select portrait...'}
              </option>
              {availablePortraits.map((portrait) => (
                <option key={portrait.id} value={portrait.imageUrl}>
                  {portrait.name}
                </option>
              ))}
            </select>
          </FormGroup>

          <CreateButton type="submit" disabled={!canSubmit || portraitsLoading} onClick={handleSubmit}>
            {portraitsLoading ? 'Loading...' : 'Begin Your Philosophical Journey'}
          </CreateButton>
        </LeftSquare>

        <RightSquare>
          <h2>Character Preview</h2>

          <PortraitDisplay>
            {selectedPortrait ? (
              <img src={selectedPortrait} alt="Character portrait" />
            ) : (
              <div className="placeholder">
                Select Portrait
              </div>
            )}
          </PortraitDisplay>

          <StatsContainer>
            <div className="age-hp-mp">
              Age: 10 • 50 HP • 20 MP
            </div>

            <div className="stat-group">
              <div className="group-title">Body Stats</div>
              <div className="stat-line">
                <span className="stat-name">Body</span>
                <span className="stat-value">{bodyScore}</span>
              </div>
              <div className="stat-line">
                <span className="stat-name">Phys Atk</span>
                <span className="stat-value">1</span>
              </div>
              <div className="stat-line">
                <span className="stat-name">Phys Def</span>
                <span className="stat-value">1</span>
              </div>
              <div className="stat-line">
                <span className="stat-name">Constitution Save</span>
                <span className="stat-value">1</span>
              </div>
            </div>

            <div className="stat-group">
              <div className="group-title">Mind Stats</div>
              <div className="stat-line">
                <span className="stat-name">Mind</span>
                <span className="stat-value">{mindScore}</span>
              </div>
              <div className="stat-line">
                <span className="stat-name">Mental Atk</span>
                <span className="stat-value">1</span>
              </div>
              <div className="stat-line">
                <span className="stat-name">Mental Def</span>
                <span className="stat-value">1</span>
              </div>
              <div className="stat-line">
                <span className="stat-name">Reflex Save</span>
                <span className="stat-value">1</span>
              </div>
            </div>

            <div className="stat-group">
              <div className="group-title">Heart Stats</div>
              <div className="stat-line">
                <span className="stat-name">Heart</span>
                <span className="stat-value">{heartScore}</span>
              </div>
              <div className="stat-line">
                <span className="stat-name">Ailment Atk</span>
                <span className="stat-value">1</span>
              </div>
              <div className="stat-line">
                <span className="stat-name">Ailment Def</span>
                <span className="stat-value">1</span>
              </div>
              <div className="stat-line">
                <span className="stat-name">Critical Chance</span>
                <span className="stat-value">1</span>
              </div>
              <div className="stat-line">
                <span className="stat-name">Will Save</span>
                <span className="stat-value">1</span>
              </div>
            </div>

            <div className="derived-stats">
              <div className="derived-title">Derived Stats</div>
              <div className="stat-line">
                <span className="stat-name">Accuracy</span>
                <span className="stat-value">{bodyScore + mindScore}</span>
              </div>
              <div className="stat-line">
                <span className="stat-name">Evasion</span>
                <span className="stat-value">{mindScore + heartScore}</span>
              </div>
              <div className="stat-line">
                <span className="stat-name">Luck</span>
                <span className="stat-value">{bodyScore + heartScore}</span>
              </div>
            </div>
          </StatsContainer>
        </RightSquare>
      </CreationContainer>
    </Container>
  );
};