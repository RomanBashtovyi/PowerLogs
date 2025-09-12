// Touch target sizes (Apple HIG recommendations)
export const TOUCH_TARGET = {
  MIN_SIZE: 44, // pixels
  RECOMMENDED_SIZE: 48,
  LARGE_SIZE: 56,
} as const

// Breakpoints (Tailwind defaults)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

// Animation durations
export const ANIMATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const

// Z-index scale
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  TOAST: 1080,
} as const
