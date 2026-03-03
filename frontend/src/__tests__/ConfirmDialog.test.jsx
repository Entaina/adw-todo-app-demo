import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ConfirmDialog from '../components/ConfirmDialog'

describe('ConfirmDialog', () => {
  it('does not render when isOpen is false', () => {
    const { container } = render(
      <ConfirmDialog
        isOpen={false}
        message="Test message"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders the message when open', () => {
    const testMessage = 'Are you sure you want to delete this item?'
    render(
      <ConfirmDialog
        isOpen={true}
        message={testMessage}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    )
    expect(screen.getByText(testMessage)).toBeInTheDocument()
  })

  it('shows Cancelar and Eliminar buttons', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        message="Test message"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    )
    expect(screen.getByText('Cancelar')).toBeInTheDocument()
    expect(screen.getByText('Eliminar')).toBeInTheDocument()
  })

  it('calls onCancel when Cancelar button is clicked', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()

    render(
      <ConfirmDialog
        isOpen={true}
        message="Test message"
        onConfirm={vi.fn()}
        onCancel={onCancel}
      />
    )

    await user.click(screen.getByText('Cancelar'))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('calls onConfirm when Eliminar button is clicked', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()

    render(
      <ConfirmDialog
        isOpen={true}
        message="Test message"
        onConfirm={onConfirm}
        onCancel={vi.fn()}
      />
    )

    await user.click(screen.getByText('Eliminar'))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })
})
