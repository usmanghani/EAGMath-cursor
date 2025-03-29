import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Problem from '../Problem'

describe('Problem Component', () => {
  it('renders addition problem correctly', () => {
    render(<Problem firstNumber={4} secondNumber={3} operation="+" />)
    expect(screen.getByText('4 + 3 =')).toBeInTheDocument()
  })

  it('renders subtraction problem correctly', () => {
    render(<Problem firstNumber={7} secondNumber={2} operation="-" />)
    expect(screen.getByText('7 - 2 =')).toBeInTheDocument()
  })

  it('updates when props change', () => {
    const { rerender } = render(<Problem firstNumber={4} secondNumber={3} operation="+" />)
    expect(screen.getByText('4 + 3 =')).toBeInTheDocument()

    rerender(<Problem firstNumber={5} secondNumber={2} operation="-" />)
    expect(screen.getByText('5 - 2 =')).toBeInTheDocument()
  })
}) 