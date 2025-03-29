import React from 'react';
import styled from 'styled-components';

const NumberLineContainer = styled.div`
  position: absolute;
  bottom: 20%;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Line = styled.div`
  width: 100%;
  height: 4px;
  background-color: #333;
  position: relative;
  margin: 10px 0;
`;

const TickMarksContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  position: relative;
`;

const TickMark = styled.div`
  width: 2px;
  height: 10px;
  background-color: #333;
  position: absolute;
`;

const Number = styled.span<{ $highlighted: boolean; $isClickable: boolean }>`
  font-size: 24px;
  color: ${props => props.$highlighted ? '#FF4444' : '#333'};
  font-weight: ${props => props.$highlighted ? 'bold' : 'normal'};
  position: absolute;
  transform: translateX(-50%);
  font-family: 'Arial Rounded MT Bold', 'Arial', sans-serif;
  cursor: ${props => props.$isClickable ? 'pointer' : 'default'};
  transition: transform 0.2s;
  
  &:hover {
    transform: ${props => props.$isClickable ? 'translateX(-50%) scale(1.2)' : 'translateX(-50%)'};
  }
`;

interface NumberLineProps {
  start: number;
  end: number;
  highlightedNumber: number;
  onNumberClick?: (number: number) => void;
  isInteractive?: boolean;
}

const NumberLine: React.FC<NumberLineProps> = ({ 
  start, 
  end, 
  highlightedNumber,
  onNumberClick,
  isInteractive = false
}) => {
  const numbers = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const handleClick = (num: number) => {
    if (isInteractive && onNumberClick) {
      onNumberClick(num);
    }
  };

  return (
    <NumberLineContainer>
      <Line />
      <TickMarksContainer>
        {numbers.map((num, index) => {
          const position = `${(index / (numbers.length - 1)) * 100}%`;
          return (
            <React.Fragment key={num}>
              <TickMark 
                data-testid={`tick-${num}`}
                style={{ left: position }} 
              />
              <Number 
                data-testid={`number-${num}`}
                style={{ left: position }}
                $highlighted={num === highlightedNumber}
                $isClickable={isInteractive}
                onClick={() => handleClick(num)}
              >
                {num}
              </Number>
            </React.Fragment>
          );
        })}
      </TickMarksContainer>
    </NumberLineContainer>
  );
};

export default NumberLine; 