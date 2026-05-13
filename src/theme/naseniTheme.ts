// File: src/theme/index.ts (UPDATED with NASENI brand for landing page)
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
  
  // Landing page specific colors (dark theme, NASENI blue brand)
  landing: {
    bg: {
      primary: '#080f22',     // Deep navy background
      secondary: '#0D1B3E',   // Card background (lighter navy)
      overlay: 'rgba(8,15,34,0.85)',
    },
    // NASENI brand colors for landing page
    brand: {
      50: '#E6F0FA',
      100: '#B3D1E8',
      200: '#80B2D6',
      300: '#4D93C4',
      400: '#1A74B2',
      500: '#003366',         // Primary - deep blue
      600: '#002952',
      700: '#001F3D',
      800: '#001529',
      900: '#000A14',
      // Lighter variants for better contrast on dark bg
      light: '#407ebd',       // Secondary - lighter blue for accents
      hover: '#1a5a9e',       // Hover state
      glow: 'rgba(64,126,189,0.15)', // Glow effect
    },
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255,255,255,0.7)',
      tertiary: 'rgba(255,255,255,0.55)',
      quaternary: 'rgba(255,255,255,0.45)',
      muted: 'rgba(255,255,255,0.35)',
      subtle: 'rgba(255,255,255,0.25)',
    },
    border: {
      light: 'rgba(255,255,255,0.06)',
      medium: 'rgba(255,255,255,0.075)',
      strong: 'rgba(255,255,255,0.1)',
      brand: 'rgba(64,126,189,0.35)',      // Using secondary for borders
      brandLight: 'rgba(64,126,189,0.2)',
      brandStrong: 'rgba(64,126,189,0.5)',
    },
    status: {
      success: '#00a86b',     // NASENI accent green
      error: '#e53e3e',       // NASENI danger
      info: '#407ebd',        // NASENI secondary
    },
    gradients: {
      brand: 'linear-gradient(135deg, #003366 0%, #407ebd 100%)',
      brandHover: 'linear-gradient(135deg, #002952 0%, #1a5a9e 100%)',
      brandShimmer: 'linear-gradient(90deg, #003366, #407ebd, #003366)',
      connector: 'linear-gradient(180deg, #407ebd, transparent)',
      modalAccent: 'linear-gradient(90deg, transparent, #407ebd, transparent)',
    },
    shadows: {
      brand: '0 8px 24px rgba(0,51,102,0.35)',
      brandHover: '0 12px 32px rgba(0,51,102,0.5)',
      brandStrong: '0 16px 40px rgba(0,51,102,0.55)',
      card: '0 40px 80px rgba(0,0,0,0.5)',
      floating: '0 8px 24px rgba(0,0,0,0.3)',
    },
  },
};

// Typography system
const fonts = {
  body: "'Segoe UI', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
  heading: "'Segoe UI', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
  mono: "'Courier New', Courier, monospace",
  landingHeading: "'Sora', sans-serif",
  landingBody: "'Lora', serif",
  landingMono: "'DM Mono', monospace",
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
      // Landing page button variants - using NASENI brand
      'landing-brand': {
        bg: 'landing.gradients.brand',
        color: 'white',
        fontFamily: 'landingHeading',
        fontWeight: '700',
        letterSpacing: '0.04em',
        borderRadius: '12px',
        shadow: 'landing.shadows.brand',
        transition: 'all 0.25s ease',
        _hover: {
          transform: 'translateY(-2px)',
          bg: 'landing.gradients.brandHover',
          shadow: 'landing.shadows.brandHover',
        },
        _active: {
          transform: 'translateY(0)',
        },
      },
      'landing-outline': {
        bg: 'transparent',
        border: '1px solid',
        borderColor: 'landing.border.brand',
        color: 'landing.brand.light',
        fontFamily: 'landingHeading',
        fontWeight: '600',
        letterSpacing: '0.05em',
        borderRadius: '8px',
        transition: 'all 0.2s',
        _hover: {
          bg: 'landing.brand.glow',
          borderColor: 'landing.border.brandStrong',
          shadow: '0 0 20px rgba(64,126,189,0.15)',
        },
      },
      'landing-ghost': {
        color: 'landing.text.quaternary',
        fontFamily: 'landingHeading',
        fontWeight: '500',
        borderRadius: '12px',
        _hover: {
          color: 'landing.text.primary',
          bg: 'rgba(255,255,255,0.05)',
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
      'landing-glass': {
        bg: 'rgba(255,255,255,0.04)',
        border: '1px solid',
        borderColor: 'landing.border.strong',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        overflow: 'hidden',
        shadow: 'landing.shadows.card',
      },
      'landing-benefit': {
        p: 7,
        borderRadius: '20px',
        bg: 'rgba(255,255,255,0.032)',
        border: '1px solid',
        borderColor: 'landing.border.medium',
        backdropFilter: 'blur(12px)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        _hover: {
          bg: 'rgba(255,255,255,0.06)',
          borderColor: 'landing.border.brand',
          transform: 'translateY(-4px)',
          shadow: 'landing.shadows.card',
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
    variants: {
      'landing-hero': {
        fontFamily: 'landingHeading',
        fontWeight: '800',
        color: 'landing.text.primary',
        letterSpacing: '-0.02em',
      },
      'landing-section': {
        fontFamily: 'landingHeading',
        fontWeight: '800',
        color: 'landing.text.primary',
        letterSpacing: '-0.02em',
      },
    },
  },
  Text: {
    variants: {
      'landing-mono': {
        fontFamily: 'landingMono',
        letterSpacing: '0.04em',
      },
      'landing-serif': {
        fontFamily: 'landingBody',
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