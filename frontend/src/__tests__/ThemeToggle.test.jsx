import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import ThemeToggle from '../components/ThemeToggle';
import * as useThemeModule from '../hooks/useTheme';

describe('ThemeToggle', () => {
  let mockToggleTheme;

  beforeEach(() => {
    mockToggleTheme = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly', () => {
    vi.spyOn(useThemeModule, 'useTheme').mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
    });

    render(<ThemeToggle />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('should show moon icon when theme is light', () => {
    vi.spyOn(useThemeModule, 'useTheme').mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
    });

    render(<ThemeToggle />);

    const button = screen.getByRole('button');
    expect(button.textContent).toBe('🌙');
    expect(button).toHaveAttribute('aria-label', 'Switch to dark theme');
  });

  it('should show sun icon when theme is dark', () => {
    vi.spyOn(useThemeModule, 'useTheme').mockReturnValue({
      theme: 'dark',
      toggleTheme: mockToggleTheme,
    });

    render(<ThemeToggle />);

    const button = screen.getByRole('button');
    expect(button.textContent).toBe('☀️');
    expect(button).toHaveAttribute('aria-label', 'Switch to light theme');
  });

  it('should call toggleTheme when button is clicked', () => {
    vi.spyOn(useThemeModule, 'useTheme').mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
    });

    render(<ThemeToggle />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('should have appropriate accessibility attributes', () => {
    vi.spyOn(useThemeModule, 'useTheme').mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
    });

    render(<ThemeToggle />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label');
    expect(button).toHaveAttribute('title');
  });
});
