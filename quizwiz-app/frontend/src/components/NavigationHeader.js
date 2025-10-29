import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const HeaderContainer = styled.div`
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 16px 0;
  margin-bottom: 24px;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const BackButton = styled.button`
  background: none;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-size: 14px;
  transition: all 0.2s;

  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const NavigationHeader = ({ 
  title, 
  backTo = '/', 
  backLabel = 'Dashboard',
  showProfile = true 
}) => {
  const navigate = useNavigate();

  return (
    <HeaderContainer>
      <HeaderContent>
        <LeftSection>
          <BackButton onClick={() => navigate(backTo)}>
            ← {backLabel}
          </BackButton>
          <Title>{title}</Title>
        </LeftSection>
        <RightSection>
          {showProfile && (
            <BackButton onClick={() => navigate('/profile')}>
              Profile
            </BackButton>
          )}
        </RightSection>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default NavigationHeader;
