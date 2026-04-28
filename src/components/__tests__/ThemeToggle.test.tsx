import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from '../ThemeToggle';
import { ThemeProvider } from '../ThemeProvider';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock matchMedia
const mockMatchMedia = jest.fn();
Object.defineProperty(window, 'matchMedia', {
  value: mockMatchMedia,
});

describe('ThemeToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    });
  });

  it('should render with proper accessibility attributes', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label');
    expect(button).toHaveAttribute('aria-pressed');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('should cycle through themes: light -> dark -> system -> light', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole('button');

    // Initial state should be system (default)
    expect(button).toHaveAttribute('aria-label', 'Switch to light mode');

    // Click to go to light
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');

    // Click to go to dark
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-label', 'Switch to system preference');

    // Click to go to system
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
  });

  it('should support keyboard navigation', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole('button');

    // Test Enter key
    fireEvent.keyDown(button, { key: 'Enter' });
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');

    // Test Space key
    fireEvent.keyDown(button, { key: ' ' });
    expect(button).toHaveAttribute('aria-label', 'Switch to system preference');

    // Test other keys (should not trigger)
    fireEvent.keyDown(button, { key: 'Escape' });
    expect(button).toHaveAttribute('aria-label', 'Switch to system preference');
  });

  it('should show appropriate icon for each theme', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole('button');

    // Check that all three icons are present
    const sunIcon = button.querySelector('.theme-toggle__icon--sun');
    const moonIcon = button.querySelector('.theme-toggle__icon--moon');
    const systemIcon = button.querySelector('.theme-toggle__icon--system');

    expect(sunIcon).toBeInTheDocument();
    expect(moonIcon).toBeInTheDocument();
    expect(systemIcon).toBeInTheDocument();

    // Initially system should be active (default)
    expect(systemIcon).toHaveClass('active');
    expect(sunIcon).not.toHaveClass('active');
    expect(moonIcon).not.toHaveClass('active');
  });

  it('should have proper title attribute showing current theme', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole('button');

    // Should show system theme with resolved theme
    expect(button).toHaveAttribute('title', 'Current: System (light)');

    // Click to light theme
    fireEvent.click(button);
    expect(button).toHaveAttribute('title', 'Current: light');

    // Click to dark theme
    fireEvent.click(button);
    expect(button).toHaveAttribute('title', 'Current: dark');
  });

  it('should handle system preference changes when in system mode', () => {
    const mockAddEventListener = jest.fn();
    const mockRemoveEventListener = jest.fn();
    
    mockMatchMedia.mockReturnValue({
      matches: false, // Initially light
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
    });

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole('button');

    // Should be in system mode initially
    expect(button).toHaveAttribute('title', 'Current: System (light)');

    // Verify that system preference listener was set up
    expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });
});