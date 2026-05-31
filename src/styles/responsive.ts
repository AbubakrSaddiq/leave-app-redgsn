
// ============================================
// NASENI Enterprise - Responsive Design System
// Centralized configuration for all responsive values
// ============================================

import { useBreakpointValue } from "@chakra-ui/react";

// ============================================
// 1. BREAKPOINTS
// ============================================

export const breakpoints = {
  base: 0,      // Mobile (0-479px)
  xs: 480,      // Large phone (480-575px)
  sm: 576,      // Phablet (576-767px)
  md: 768,      // Tablet (768-991px)
  lg: 992,      // Small laptop (992-1279px)
  xl: 1280,     // Desktop (1280px+)
  '2xl': 1536,  // Large desktop
} as const;

export type Breakpoint = keyof typeof breakpoints;

// Chakra UI breakpoint keys (for use in sx props)
export const chakraBreakpoints = {
  base: "base",
  xs: "xs",
  sm: "sm",
  md: "md",
  lg: "lg",
  xl: "xl",
  '2xl': "2xl",
} as const;

// ============================================
// 2. TYPOGRAPHY - Font Sizes
// ============================================

export const fontSizes = {
  // Heading sizes
  headings: {
    hero: {
      base: "3xl",    // 30px
      sm: "4xl",      // 36px
      md: "5xl",      // 48px
      lg: "6xl",      // 60px
      xl: "7xl",      // 72px
    },
    section: {
      base: "2xl",    // 24px
      md: "3xl",      // 30px
      lg: "4xl",      // 36px
    },
    card: {
      base: "md",     // 16px
      md: "lg",       // 18px
    },
    pageTitle: {
      base: "xl",     // 20px
      sm: "2xl",      // 24px
      md: "3xl",      // 30px
    },
  },
  
  // Body text sizes
  body: {
    large: {
      base: "sm",     // 14px
      md: "md",       // 16px
      lg: "lg",       // 18px
    },
    medium: {
      base: "sm",     // 14px
      md: "md",       // 16px
    },
    small: {
      base: "xs",     // 12px
      md: "sm",       // 14px
    },
    caption: {
      base: "2xs",    // 10px
      md: "xs",       // 12px
    },
  },
  
  // Special text
  badge: {
    base: "2xs",      // 10px
    md: "xs",         // 12px
  },
  mono: {
    base: "2xs",      // 10px
    sm: "xs",         // 12px
    md: "sm",         // 14px
  },
} as const;

// ============================================
// 3. SPACING & LAYOUT
// ============================================

export const spacing = {
  // Container padding
  container: {
    base: 3,      // 12px
    sm: 4,        // 16px
    md: 6,        // 24px
    lg: 8,        // 32px
  },
  
  // Section padding (vertical)
  section: {
    base: 8,      // 32px
    md: 12,       // 48px
    lg: 16,       // 64px
    xl: 24,       // 96px
  },
  
  // Card padding
  card: {
    base: 4,      // 16px
    sm: 5,        // 20px
    md: 6,        // 24px
  },
  
  // Gaps between elements
  gaps: {
    xs: 1,        // 4px
    sm: 2,        // 8px
    md: 3,        // 12px
    lg: 4,        // 16px
    xl: 6,        // 24px
    '2xl': 8,     // 32px
  },
  
  // Stack spacing (VStack/HStack)
  stackSpacing: {
    xs: 2,        // 8px
    sm: 3,        // 12px
    md: 4,        // 16px
    lg: 5,        // 20px
    xl: 6,        // 24px
    '2xl': 8,     // 32px
  },
  
  // Grid gaps
  gridGaps: {
    tight: {
      base: 2,    // 8px
      md: 3,      // 12px
      lg: 4,      // 16px
    },
    normal: {
      base: 3,    // 12px
      md: 4,      // 16px
      lg: 6,      // 24px
    },
    wide: {
      base: 4,    // 16px
      md: 6,      // 24px
      lg: 8,      // 32px
    },
  },
} as const;

// ============================================
// 4. COMPONENT SIZES
// ============================================

export const componentSizes = {
  // Button sizes
  buttons: {
    xs: {
      base: "xs",   // 24px height
      md: "sm",     // 32px height
    },
    sm: {
      base: "sm",   // 32px height
      md: "md",     // 40px height
    },
    md: {
      base: "md",   // 40px height
      md: "lg",     // 48px height
    },
    lg: {
      base: "md",   // 40px height
      md: "lg",     // 48px height
    },
  },
  
  // Input sizes
  inputs: {
    sm: {
      base: "sm",   // 32px height
      md: "md",     // 40px height
    },
    md: {
      base: "md",   // 40px height
      md: "lg",     // 48px height
    },
  },
  
  // Avatar sizes
  avatar: {
    sm: {
      base: 8,      // 32px
      md: 10,       // 40px
    },
    md: {
      base: 10,     // 40px
      md: 12,       // 48px
    },
    lg: {
      base: 12,     // 48px
      md: 16,       // 64px
    },
  },
  
  // Icon sizes
  icons: {
    xs: {
      base: 3,      // 12px
      md: 3.5,      // 14px
    },
    sm: {
      base: 3.5,    // 14px
      md: 4,        // 16px
    },
    md: {
      base: 4,      // 16px
      md: 5,        // 20px
    },
    lg: {
      base: 5,      // 20px
      md: 6,        // 24px
    },
  },
} as const;

// ============================================
// 5. GRID & LAYOUT PATTERNS
// ============================================

export const gridPatterns = {
  // Dashboard card grid
  cards: {
    base: "1fr",
    sm: "repeat(2, 1fr)",
    md: "repeat(2, 1fr)",
    lg: "repeat(3, 1fr)",
    xl: "repeat(4, 1fr)",
  },
  
  // Hero section grid
  hero: {
    base: "1fr",
    lg: "repeat(3, 1fr)",
  },
  
  // Two column layout
  twoColumn: {
    base: "1fr",
    md: "repeat(2, 1fr)",
  },
  
  // Sidebar layout
  sidebar: {
    base: "1fr",
    md: "250px 1fr",
    lg: "280px 1fr",
  },
  
  // Leave types grid
  leaveTypes: {
    base: "repeat(2, 1fr)",
    sm: "repeat(3, 1fr)",
    md: "repeat(4, 1fr)",
    lg: "repeat(6, 1fr)",
  },
} as const;

// ============================================
// 6. DIRECTION & ALIGNMENT
// ============================================

export const layoutDirections = {
  // Stack direction (row/column)
  stack: {
    mobileVertical: {
      base: "column",
      md: "row",
    },
    mobileHorizontal: {
      base: "column",
      sm: "row",
    },
  },
  
  // Alignment
  alignment: {
    centerOnMobile: {
      base: "center",
      md: "flex-start",
    },
    leftOnDesktop: {
      base: "center",
      md: "left",
    },
  },
  
  // Text alignment
  textAlign: {
    centerOnMobile: {
      base: "center",
      md: "left",
    },
    leftOnDesktop: {
      base: "center",
      md: "left",
    },
  },
} as const;

// ============================================
// 7. RESPONSIVE HOOKS (Reusable)
// ============================================

/**
 * Custom hook to check if current screen is mobile
 */
export const useIsMobile = () => {
  return useBreakpointValue({ base: true, md: false }) ?? false;
};

/**
 * Custom hook to check if current screen is tablet
 */
export const useIsTablet = () => {
  return useBreakpointValue({ base: false, md: true, lg: false }) ?? false;
};

/**
 * Custom hook to check if current screen is desktop
 */
export const useIsDesktop = () => {
  return useBreakpointValue({ base: false, lg: true }) ?? false;
};

/**
 * Custom hook to get current breakpoint
 */
export const useCurrentBreakpoint = (): Breakpoint => {
  const breakpoint = useBreakpointValue({
    base: "base",
    xs: "xs",
    sm: "sm",
    md: "md",
    lg: "lg",
    xl: "xl",
    '2xl': "2xl",
  });
  return (breakpoint as Breakpoint) ?? "base";
};

// ============================================
// 8. HELPER FUNCTIONS
// ============================================

/**
 * Get responsive font size for heading
 */
export const getHeadingFontSize = (
  type: keyof typeof fontSizes.headings,
  customBreakpoints?: Partial<Record<Breakpoint, string>>
) => {
  if (customBreakpoints) return customBreakpoints;
  return fontSizes.headings[type];
};

/**
 * Get responsive spacing value
 */
export const getSpacing = (
  type: keyof typeof spacing,
  subType?: string
) => {
  if (subType && spacing[type] && (spacing[type] as any)[subType]) {
    return (spacing[type] as any)[subType];
  }
  return spacing[type as keyof typeof spacing];
};

/**
 * Get responsive grid template
 */
export const getGridTemplate = (
  pattern: keyof typeof gridPatterns
) => {
  return gridPatterns[pattern];
};

// ============================================
// 9. COMPONENT-SPECIFIC RESPONSIVE CONFIG
// ============================================

export const componentResponsive = {
  // BalanceDashboard component
  balanceDashboard: {
    headerDirection: layoutDirections.stack.mobileVertical,
    statLayout: {
      base: "vertical",
      md: "horizontal",
    },
    alertDirection: {
      base: "column",
      sm: "row",
    },
    cardGrid: gridPatterns.cards,
  },
  
  // ProfilePage component
  profilePage: {
    tabLabels: {
      base: { general: "Info", security: "Security" },
      sm: { general: "General", security: "Security" },
    },
    tabListOverflow: {
      base: "auto",
      md: "visible",
    },
    buttonDirection: layoutDirections.stack.mobileVertical,
  },
  
  // LandingPage component
  landingPage: {
    heroGrid: gridPatterns.hero,
    trustSignalsDirection: {
      base: "column",
      sm: "row",
    },
    ctaButtonWidth: {
      base: "90%",
      sm: "auto",
    },
  },
  
  // Navigation/Sidebar
  navigation: {
    sidebarDisplay: {
      base: "none",
      md: "block",
    },
    mobileMenuButton: {
      base: "block",
      md: "none",
    },
  },
  
  // Modal
  modal: {
    size: {
      base: "full",
      sm: "md",
    },
    borderRadius: {
      base: 0,
      sm: "20px",
    },
  },
} as const;

// ============================================
// 10. EXPORT ALL AS SINGLE OBJECT
// ============================================

export const responsiveConfig = {
  breakpoints,
  chakraBreakpoints,
  fontSizes,
  spacing,
  componentSizes,
  gridPatterns,
  layoutDirections,
  componentResponsive,
  // Hooks
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useCurrentBreakpoint,
  // Helpers
  getHeadingFontSize,
  getSpacing,
  getGridTemplate,
} as const;

export default responsiveConfig;