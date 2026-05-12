// ============================================
// NASENI Enterprise Theme Configuration
// Brand colors and design system
// ============================================

import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

// NASENI Brand Colors
const colors = {
  naseni: {
    primary: '#003366',      // Deep blue
    secondary: '#407ebd',    // Professional blue
    accent: '#00a86b',       // Success green
    warning: '#ff9500',      // Alert orange
    danger: '#e53e3e',       // Error red
    
    // Neutral palette
    light: '#f7fafc',        // Very light blue-gray
    lighter: '#edf2f7',      // Light blue-gray
    dark: '#1a202c',         // Almost black
    
    // Grays
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
  },
};

// Typography system
const fonts = {
  body: "'Segoe UI', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
  heading: "'Segoe UI', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
  mono: "'Courier New', Courier, monospace",
};

// Component defaults
const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

// Custom component styles
const components = {
  Button: {
    defaultProps: {
      colorScheme: 'naseni',
    },
    variants: {
      solid: {
        bg: 'naseni.primary',
        color: 'white',
        _hover: {
          bg: '#002244',
          transform: 'translateY(-1px)',
          shadow: 'lg',
        },
        _active: {
          bg: '#001a33',
        },
      },
      outline: {
        borderColor: 'naseni.primary',
        color: 'naseni.primary',
        _hover: {
          bg: 'naseni.light',
        },
      },
      ghost: {
        color: 'naseni.primary',
        _hover: {
          bg: 'naseni.light',
        },
      },
    },
  },
  Card: {
    variants: {
      elevated: {
        bg: 'white',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
        borderRadius: 'xl',
        transition: 'all 0.3s ease',
        _hover: {
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          transform: 'translateY(-2px)',
        },
      },
    },
  },
  Input: {
    defaultProps: {
      focusBorderColor: 'naseni.secondary',
    },
  },
  Textarea: {
    defaultProps: {
      focusBorderColor: 'naseni.secondary',
    },
  },
  Select: {
    defaultProps: {
      focusBorderColor: 'naseni.secondary',
    },
  },
  Heading: {
    sizes: {
      xl: {
        fontSize: ['24px', '32px'],
        fontWeight: '700',
        lineHeight: '1.2',
        color: 'naseni.dark',
      },
      lg: {
        fontSize: ['18px', '24px'],
        fontWeight: '700',
        lineHeight: '1.3',
        color: 'naseni.dark',
      },
    },
  },
};

// Create the custom theme
const theme = extendTheme({
  config,
  colors,
  fonts,
  components,
  styles: {
    global: {
      'html, body': {
        bg: 'naseni.light',
        color: 'naseni.dark',
        fontFamily: fonts.body,
      },
      a: {
        color: 'naseni.secondary',
        _hover: {
          textDecoration: 'underline',
        },
      },
    },
  },
});

export default theme;