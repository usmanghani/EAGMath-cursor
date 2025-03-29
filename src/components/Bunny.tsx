import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const BunnyContainer = styled(motion.div)`
  position: absolute;
  bottom: 40%;
  width: 80px;
  height: 80px;
  transform-origin: center bottom;
`;

const BunnyCharacter = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const BunnyBody = styled.div`
  width: 60px;
  height: 60px;
  background-color: #D4A685;
  border-radius: 50%;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
`;

const BunnyEar = styled.div`
  width: 20px;
  height: 40px;
  background-color: #D4A685;
  border-radius: 10px;
  position: absolute;
  bottom: 45px;

  &.left {
    left: 15px;
    transform: rotate(-10deg);
  }

  &.right {
    right: 15px;
    transform: rotate(10deg);
  }
`;

const BunnyFace = styled.div`
  width: 40px;
  height: 30px;
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
`;

const BunnyEye = styled.div`
  width: 8px;
  height: 8px;
  background-color: #333;
  border-radius: 50%;
  position: absolute;
  top: 5px;

  &.left {
    left: 8px;
  }

  &.right {
    right: 8px;
  }
`;

const BunnyNose = styled.div`
  width: 8px;
  height: 8px;
  background-color: #FF9999;
  border-radius: 50%;
  position: absolute;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
`;

interface BunnyProps {
  isJumping: boolean;
  currentStep: number;
  operation: '+' | '-';
  isCorrect?: boolean;
  isSad?: boolean;
}

const Bunny: React.FC<BunnyProps> = ({ 
  isJumping, 
  currentStep, 
  operation,
  isCorrect,
  isSad
}) => {
  const position = `${(currentStep / 8) * 100}%`;
  const xPosition = operation === '+' ? position : `calc(100% - ${position})`;

  const getAnimation = () => {
    if (isCorrect) {
      return {
        y: [0, -50, 0],
        rotate: [0, 10, -10, 0],
        transition: { duration: 0.8, repeat: 2 }
      };
    }
    if (isSad) {
      return {
        y: [0, -20, 0],
        rotate: [0, -5, 5, 0],
        transition: { duration: 0.5 }
      };
    }
    if (isJumping) {
      return {
        y: [0, -100, 0],
        rotate: [0, -10, 0],
        transition: { duration: 0.5 }
      };
    }
    return {
      y: 0,
      rotate: 0,
      transition: { duration: 0.5 }
    };
  };

  return (
    <BunnyContainer
      data-testid="bunny-container"
      data-jumping={isJumping}
      data-correct={isCorrect}
      data-sad={isSad}
      style={{ left: xPosition }}
      animate={getAnimation()}
    >
      <BunnyCharacter>
        <BunnyEar data-testid="bunny-ear-left" className="left" />
        <BunnyEar data-testid="bunny-ear-right" className="right" />
        <BunnyBody data-testid="bunny-body">
          <BunnyFace>
            <BunnyEye className="left" />
            <BunnyEye className="right" />
            <BunnyNose data-testid="bunny-nose" />
          </BunnyFace>
        </BunnyBody>
      </BunnyCharacter>
    </BunnyContainer>
  );
};

export default Bunny; 