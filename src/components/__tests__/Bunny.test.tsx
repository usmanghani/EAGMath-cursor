/// <reference types="vitest" />
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Bunny from '../Bunny'

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, animate, ...props }: any) => (
      <div data-animate={JSON.stringify(animate)} {...props}>
        {children}
      </div>
    )
  }
}))

describe('Bunny Component', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Bunny isJumping={false} currentStep={0} operation="+" />
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('applies correct position for addition', () => {
    const { getByTestId } = render(
      <Bunny isJumping={false} currentStep={4} operation="+" />
    )
    const bunnyContainer = getByTestId('bunny-container')
    expect(bunnyContainer).toHaveStyle({ left: '50%' })
  })

  it('applies correct position for subtraction', () => {
    const { getByTestId } = render(
      <Bunny isJumping={false} currentStep={4} operation="-" />
    )
    const bunnyContainer = getByTestId('bunny-container')
    expect(bunnyContainer).toHaveStyle({ left: 'calc(100% - 50%)' })
  })

  it('applies jump animation when isJumping is true', () => {
    const { getByTestId } = render(
      <Bunny isJumping={true} currentStep={0} operation="+" />
    )
    const bunnyContainer = getByTestId('bunny-container')
    expect(bunnyContainer).toHaveAttribute('data-jumping', 'true')
  })

  it('applies correct animation when answer is correct', () => {
    const { getByTestId } = render(
      <Bunny isJumping={false} currentStep={0} operation="+" isCorrect={true} />
    )
    const bunnyContainer = getByTestId('bunny-container')
    expect(bunnyContainer).toHaveAttribute('data-correct', 'true')
  })

  it('applies sad animation when answer is incorrect', () => {
    const { getByTestId } = render(
      <Bunny isJumping={false} currentStep={0} operation="+" isSad={true} />
    )
    const bunnyContainer = getByTestId('bunny-container')
    expect(bunnyContainer).toHaveAttribute('data-sad', 'true')
  })

  it('renders all bunny parts', () => {
    const { getByTestId } = render(
      <Bunny isJumping={false} currentStep={0} operation="+" />
    )
    expect(getByTestId('bunny-ear-left')).toBeInTheDocument()
    expect(getByTestId('bunny-ear-right')).toBeInTheDocument()
    expect(getByTestId('bunny-body')).toBeInTheDocument()
    expect(getByTestId('bunny-nose')).toBeInTheDocument()
  })
}) 