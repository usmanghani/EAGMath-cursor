/// <reference types="vitest" />
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import App from '../../App'

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

describe('App Component', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('renders initial problem correctly', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    render(<App />)
    expect(screen.getByText('4 + 3 =')).toBeInTheDocument()
  })

  it('generates problems within 1-10 range', () => {
    const mockRandom = vi.fn()
      .mockReturnValueOnce(0.5) // Addition
      .mockReturnValueOnce(0.2) // First number (3)
      .mockReturnValueOnce(0.3) // Second number (2)

    vi.spyOn(Math, 'random').mockImplementation(mockRandom)
    render(<App />)
    
    expect(screen.getByText('3 + 2 =')).toBeInTheDocument()
  })

  it('handles number clicks and validates answers', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    const { getByTestId } = render(<App />)
    
    // Click correct answer
    const number = screen.getByTestId('number-7')
    act(() => {
      fireEvent.click(number)
    })
    
    // Wait for animation
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    
    // Verify bunny state and score
    const bunny = getByTestId('bunny-container')
    expect(bunny).toHaveAttribute('data-correct', 'true')
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('handles incorrect answers', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    const { getByTestId } = render(<App />)
    
    // Click incorrect answer
    const number = screen.getByTestId('number-5')
    act(() => {
      fireEvent.click(number)
    })
    
    // Wait for animation
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    
    // Verify bunny state and score
    const bunny = getByTestId('bunny-container')
    expect(bunny).toHaveAttribute('data-sad', 'true')
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('increments score for correct answers', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    const { getByTestId } = render(<App />)
    
    // Click correct answer multiple times
    for (let i = 0; i < 3; i++) {
      const number = screen.getByTestId('number-7')
      act(() => {
        fireEvent.click(number)
        vi.advanceTimersByTime(1000)
      })
    }
    
    // Verify score
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('updates level based on score', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    const { getByTestId } = render(<App />)
    
    // Click correct answer 6 times to reach level 2
    for (let i = 0; i < 6; i++) {
      const number = screen.getByTestId('number-7')
      act(() => {
        fireEvent.click(number)
        vi.advanceTimersByTime(1000)
      })
    }
    
    // Verify level
    expect(screen.getByText('Level 2')).toBeInTheDocument()
  })

  it('maintains level display at top center', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    render(<App />)
    
    const levelDisplay = screen.getByText('Level 1').parentElement
    expect(levelDisplay).toHaveStyle({
      position: 'absolute',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)'
    })
  })

  it('navigates through problem history', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    const { getByTestId } = render(<App />)
    
    // Generate second problem
    const nextButton = getByTestId('next-button')
    act(() => {
      fireEvent.click(nextButton)
    })
    
    // Go back
    const prevButton = getByTestId('previous-button')
    act(() => {
      fireEvent.click(prevButton)
    })
    
    // Verify we're back at first problem
    expect(screen.getByText('4 + 3 =')).toBeInTheDocument()
  })

  it('disables previous button at start', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    const { getByTestId } = render(<App />)
    
    const prevButton = getByTestId('previous-button')
    expect(prevButton).toBeDisabled()
  })

  it('handles subtraction problems correctly', () => {
    // Mock Math.random to force a subtraction problem
    const mockRandom = vi.fn()
      .mockReturnValueOnce(0.9) // Force subtraction operation
      .mockReturnValueOnce(0.8) // First number (will be 8)
      .mockReturnValueOnce(0.2) // Second number (will be 2)

    vi.spyOn(Math, 'random').mockImplementation(mockRandom)
    
    const { getByTestId } = render(<App />)

    // Verify initial problem state
    expect(screen.getByText('8 - 2 =')).toBeInTheDocument()

    // Click correct answer
    const number = screen.getByTestId('number-6')
    act(() => {
      fireEvent.click(number)
    })

    // Wait for animation
    act(() => {
      vi.advanceTimersByTime(1000)
    })

    // Verify bunny state
    const bunny = getByTestId('bunny-container')
    expect(bunny).toHaveAttribute('data-correct', 'true')
  })
}) 