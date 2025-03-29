import React from 'react';
import styled from 'styled-components';

const ProblemContainer = styled.div`
  background-color: #FF7F7F;
  padding: 15px 30px;
  border-radius: 25px;
  margin-bottom: 40px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Text = styled.span`
  font-size: 48px;
  color: #FFFDD0;
  font-weight: bold;
  font-family: 'Arial Rounded MT Bold', 'Arial', sans-serif;
`;

interface ProblemProps {
  firstNumber: number;
  secondNumber: number;
  operation: '+' | '-';
}

const Problem: React.FC<ProblemProps> = ({ firstNumber, secondNumber, operation }) => {
  return (
    <ProblemContainer>
      <Text>{firstNumber} {operation} {secondNumber} =</Text>
    </ProblemContainer>
  );
};

export default Problem; 