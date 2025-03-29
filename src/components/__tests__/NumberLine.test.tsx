/// <reference types="vitest" />
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import NumberLine from '../NumberLine'

describe('NumberLine Component', () => {
  it('renders all numbers in the range', () => {
    render(<NumberLine start={1} end={5} highlightedNumber={3} />)
    ;[1, 2, 3, 4, 5].forEach(num => {
      expect(screen.getByTestId(`number-${num}`)).toBeInTheDocument()
    })
  })

  it('highlights the correct number', () => {
    render(<NumberLine start={1} end={5} highlightedNumber={3} />)
    const highlightedNumber = screen.getByTestId('number-3')
    expect(highlightedNumber).toHaveStyle({ color: '#FF4444' })
  })

  it('renders correct number of tick marks', () => {
    const { container } = render(<NumberLine start={1} end={5} highlightedNumber={3} />)
    const tickMarks = container.querySelectorAll('[data-testid^="tick-"]')
    expect(tickMarks.length).toBe(5)
  })

  it('handles single number range', () => {
    render(<NumberLine start={5} end={5} highlightedNumber={5} />)
    expect(screen.getByTestId('number-5')).toBeInTheDocument()
    expect(screen.getByTestId('tick-5')).toBeInTheDocument()
  })

  it('handles negative numbers', () => {
    render(<NumberLine start={-2} end={2} highlightedNumber={0} />)
    ;[-2, -1, 0, 1, 2].forEach(num => {
      expect(screen.getByTestId(`number-${num}`)).toBeInTheDocument()
      expect(screen.getByTestId(`tick-${num}`)).toBeInTheDocument()
    })
  })

  it('makes numbers clickable when interactive is true', () => {
    const handleClick = vi.fn()
    render(
      <NumberLine 
        start={1} 
        end={5} 
        highlightedNumber={3} 
        isInteractive={true}
        onNumberClick={handleClick}
      />
    )
    
    const number = screen.getByTestId('number-4')
    fireEvent.click(number)
    expect(handleClick).toHaveBeenCalledWith(4)
  })

  it('does not make numbers clickable when interactive is false', () => {
    const handleClick = vi.fn()
    render(
      <NumberLine 
        start={1} 
        end={5} 
        highlightedNumber={3} 
        isInteractive={false}
        onNumberClick={handleClick}
      />
    )
    
    const number = screen.getByTestId('number-4')
    fireEvent.click(number)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('applies hover effect to clickable numbers', () => {
    render(
      <NumberLine 
        start={1} 
        end={5} 
        highlightedNumber={3} 
        isInteractive={true}
        onNumberClick={() => {}}
      />
    )
    
    const number = screen.getByTestId('number-4')
    expect(number).toHaveStyle({ cursor: 'pointer' })
  })

  it('does not apply hover effect to non-clickable numbers', () => {
    render(
      <NumberLine 
        start={1} 
        end={5} 
        highlightedNumber={3} 
        isInteractive={false}
      />
    )
    
    const number = screen.getByTestId('number-4')
    expect(number).toHaveStyle({ cursor: 'default' })
  })
}) 