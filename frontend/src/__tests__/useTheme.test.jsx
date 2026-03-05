import { renderHook, act, waitFor } from '@testing-library/react';
import { useTheme } from '../hooks/useTheme';

describe('useTheme', () => {
  let localStorageMock;
  let matchMediaMock;

  beforeEach(() => {
    // Mock localStorage
    localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      clear: vi.fn(),
    };
    global.localStorage = localStorageMock;

    // Mock matchMedia
    matchMediaMock = {
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    global.matchMedia = vi.fn(() => matchMediaMock);

    // Mock document.documentElement.setAttribute
    document.documentElement.setAttribute = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with light theme by default', () => {
    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('light');
  });

  it('should read theme from localStorage on mount', async () => {
    localStorageMock.getItem.mockReturnValue('dark');

    const { result } = renderHook(() => useTheme());

    // Wait for useEffect to complete
    expect(localStorageMock.getItem).toHaveBeenCalledWith('theme');
    // Theme should be updated after mount
    await waitFor(() => {
      expect(result.current.theme).toBe('dark');
    });
  });

  it('should detect system preference when no stored theme', async () => {
    localStorageMock.getItem.mockReturnValue(null);
    matchMediaMock.matches = true; // prefers dark mode

    const { result } = renderHook(() => useTheme());

    expect(matchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
    // Theme should be updated after mount
    await waitFor(() => {
      expect(result.current.theme).toBe('dark');
    });
  });

  it('should toggle theme from light to dark', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('dark');
  });

  it('should toggle theme from dark to light', async () => {
    localStorageMock.getItem.mockReturnValue('dark');

    const { result } = renderHook(() => useTheme());

    // Wait for initial theme to be set
    await waitFor(() => {
      expect(result.current.theme).toBe('dark');
    });

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('light');
  });

  it('should persist theme to localStorage', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.toggleTheme();
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
  });

  it('should apply data-theme attribute to document', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.toggleTheme();
    });

    expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
  });
});
