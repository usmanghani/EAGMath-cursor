import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import NumberLine from './components/NumberLine';
import Bunny from './components/Bunny';
import Problem from './components/Problem';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #87CEEB;
  padding: 20px;
  position: relative;
  overflow: hidden;
`;

const GameContainer = styled.div`
  width: 100%;
  max-width: 600px;
  aspect-ratio: 9/16;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
`;

const Cloud = styled(motion.div)<{ $size: number }>`
  width: ${props => props.$size}px;
  height: ${props => props.$size / 2}px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50px;
  position: absolute;
  top: ${props => props.$size}px;
`;

const NavigationButtons = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  background-color: #FF7F7F;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ScoreDisplay = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: #FF7F7F;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 24px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Star = styled.span`
  color: #FFD700;
  font-size: 28px;
`;

const LevelDisplay = styled.div`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #FF7F7F;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 24px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LevelIcon = styled.span`
  color: #FFD700;
  font-size: 28px;
`;

interface Problem {
  firstNumber: number;
  secondNumber: number;
  operation: '+' | '-';
  userAnswer?: number;
  correctAnswer: number;
}

const App: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isInteractive, setIsInteractive] = useState(true);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const happySound = useRef<HTMLAudioElement | null>(null);
  const sadSound = useRef<HTMLAudioElement | null>(null);

  const level = Math.floor(score / 5) + 1;

  const generateNewProblem = useCallback(() => {
    try {
      const operations: ('+' | '-')[] = ['+', '-'];
      const operation = operations[Math.floor(Math.random() * operations.length)];
      let firstNumber, secondNumber, correctAnswer;

      if (operation === '+') {
        firstNumber = Math.floor(Math.random() * 7) + 1; // 1-7
        const maxSecondNumber = 10 - firstNumber;
        if (maxSecondNumber < 1) {
          generateNewProblem();
          return;
        }
        secondNumber = Math.floor(Math.random() * maxSecondNumber) + 1;
        correctAnswer = firstNumber + secondNumber;
      } else {
        firstNumber = Math.floor(Math.random() * 8) + 3; // 3-10
        const maxSecondNumber = firstNumber - 1;
        if (maxSecondNumber < 1) {
          generateNewProblem();
          return;
        }
        secondNumber = Math.floor(Math.random() * maxSecondNumber) + 1;
        correctAnswer = firstNumber - secondNumber;
      }

      if (correctAnswer < 1 || correctAnswer > 10) {
        generateNewProblem();
        return;
      }

      const newProblem: Problem = {
        firstNumber,
        secondNumber,
        operation,
        correctAnswer
      };

      setProblems(prev => [...prev, newProblem]);
      setCurrentProblemIndex(prev => prev + 1);
      setCurrentStep(0);
      setIsAnimating(false);
      setIsCorrect(null);
      setIsInteractive(true);
      setIsLoading(false);
      setError(null);
    } catch (error) {
      setError('Failed to generate problem. Please try again.');
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const initializeApp = () => {
      try {
        // Initialize audio
        happySound.current = new Audio('/happy.mp3');
        sadSound.current = new Audio('/sad.mp3');
        
        // Generate first problem
        generateNewProblem();
      } catch (error) {
        setError('Failed to initialize app. Please refresh the page.');
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [generateNewProblem]);

  const handleNumberClick = useCallback((number: number) => {
    if (!isInteractive) return;

    const currentProblem = problems[currentProblemIndex];
    if (!currentProblem) return;

    setIsInteractive(false);
    currentProblem.userAnswer = number;
    const isAnswerCorrect = number === currentProblem.correctAnswer;
    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
      setScore(prev => prev + 1);
      happySound.current?.play().catch(console.error);
    } else {
      sadSound.current?.play().catch(console.error);
    }

    const targetStep = currentProblem.operation === '+' 
      ? number - currentProblem.firstNumber
      : currentProblem.firstNumber - number;
    
    setCurrentStep(Math.abs(targetStep));
    setIsAnimating(true);

    setTimeout(() => {
      setIsAnimating(false);
      setIsInteractive(true);
    }, 1000);
  }, [currentProblemIndex, problems, isInteractive]);

  const handleNext = useCallback(() => {
    if (currentProblemIndex < problems.length - 1) {
      setCurrentProblemIndex(prev => prev + 1);
      setCurrentStep(0);
      setIsAnimating(false);
      setIsCorrect(null);
      setIsInteractive(true);
    } else {
      generateNewProblem();
    }
  }, [currentProblemIndex, problems.length, generateNewProblem]);

  const handlePrevious = useCallback(() => {
    if (currentProblemIndex > 0) {
      setCurrentProblemIndex(prev => prev - 1);
      setCurrentStep(0);
      setIsAnimating(false);
      setIsCorrect(null);
      setIsInteractive(true);
    }
  }, [currentProblemIndex]);

  const currentProblem = problems[currentProblemIndex];

  if (error) {
    return (
      <AppContainer>
        <div style={{ 
          color: 'white', 
          fontSize: '24px',
          textAlign: 'center',
          padding: '20px',
          backgroundColor: 'rgba(255, 0, 0, 0.2)',
          borderRadius: '10px'
        }}>
          {error}
          <Button 
            onClick={() => window.location.reload()} 
            style={{ marginTop: '20px' }}
          >
            Refresh Page
          </Button>
        </div>
      </AppContainer>
    );
  }

  if (isLoading) {
    return (
      <AppContainer>
        <div style={{ 
          color: 'white', 
          fontSize: '24px',
          textAlign: 'center',
          padding: '20px'
        }}>
          Loading...
        </div>
      </AppContainer>
    );
  }

  if (!currentProblem) {
    return (
      <AppContainer>
        <div style={{ 
          color: 'white', 
          fontSize: '24px',
          textAlign: 'center',
          padding: '20px'
        }}>
          Loading problem...
        </div>
      </AppContainer>
    );
  }

  const start = Math.max(1, currentProblem.operation === '+' 
    ? currentProblem.firstNumber - 2 
    : currentProblem.correctAnswer - 2);
  const end = currentProblem.operation === '+' 
    ? currentProblem.correctAnswer + 2 
    : currentProblem.firstNumber + 2;

  return (
    <AppContainer>
      <GameContainer>
        <ScoreDisplay>
          <Star>⭐</Star>
          {score}
        </ScoreDisplay>

        <LevelDisplay>
          <LevelIcon>🎯</LevelIcon>
          Level {level}
        </LevelDisplay>
        
        <Cloud 
          $size={100}
          animate={{ x: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
        />
        <Cloud
          $size={80}
          animate={{ x: [20, -20, 20] }}
          transition={{ repeat: Infinity, duration: 5 }}
          style={{ right: '20%', top: '15%' }}
        />
        
        <NavigationButtons>
          <Button 
            onClick={handlePrevious}
            disabled={currentProblemIndex === 0}
            data-testid="previous-button"
          >
            Previous
          </Button>
          <Button 
            onClick={handleNext}
            data-testid="next-button"
          >
            Next
          </Button>
        </NavigationButtons>

        <Problem
          firstNumber={currentProblem.firstNumber}
          secondNumber={currentProblem.secondNumber}
          operation={currentProblem.operation}
        />

        <div style={{ position: 'relative', width: '100%', flex: 1 }}>
          <Bunny
            isJumping={isAnimating}
            currentStep={currentStep}
            operation={currentProblem.operation}
            isCorrect={isCorrect === true}
            isSad={isCorrect === false}
          />
          <NumberLine
            start={start}
            end={end}
            highlightedNumber={currentProblem.operation === '+' 
              ? currentProblem.firstNumber + currentStep
              : currentProblem.firstNumber - currentStep}
            onNumberClick={handleNumberClick}
            isInteractive={isInteractive}
          />
        </div>
      </GameContainer>
    </AppContainer>
  );
};

export default App; 