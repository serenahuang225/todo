// Theme configuration for the todo app
export const theme = {
  // Color schemes
  colors: {
    // Default theme (current)
    default: {
      primary: '#85ce92',
      primaryHover: '#52b964',
      primaryLight: '#fdf6dd',
      textPrimary: '#333',
      textSecondary: '#6c757d',
      textMuted: '#999',
      textWhite: '#ffffff',
      background: '#ffffff',
      notebookBg: '#fdf6dd',
      itemBg: '#fdf2e9',

      success: '#27ae60',
      danger: '#e74c3c',
      info: '#3498db',
    },
    
    // Alternative themes
    dark: {
      primary: '#6366f1',
      primaryHover: '#4f46e5',
      primaryLight: '#312e81',
      textPrimary: '#f8fafc',
      textSecondary: '#cbd5e1',
      textMuted: '#64748b',
      textWhite: '#ffffff',
      background: '#0f172a',
      notebookBg: '#1e293b',
      itemBg: '#334155',

      success: '#10b981',
      danger: '#ef4444',
      info: '#3b82f6',
    },
    
    green: {
      primary: '#059669',
      primaryHover: '#047857',
      primaryLight: '#f0fdf4',
      textPrimary: '#111827',
      textSecondary: '#6b7280',
      textMuted: '#9ca3af',
      textWhite: '#ffffff',
      background: '#f9fafb',
      notebookBg: '#ffffff',
      itemBg: '#f9fafb',

      success: '#059669',
      danger: '#dc2626',
      info: '#2563eb',
    },
  },
  
  // Spacing scale
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    xxl: '24px',
    xxxl: '30px',
    xxxxl: '40px',
  },
  
  // Typography
  typography: {
    fontFamily: {
      primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '20px',
      xxl: '24px',
      xxxl: '48px',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      bold: 700,
    },
  },
  
  // Component dimensions
  components: {
    heights: {
      input: '25px',
      button: '32px',
      checkbox: '20px',
      deleteBtn: '24px',
      filterBtn: '25px',
      todoItem: '25px',
    },
    borderRadius: {
      none: '0',
      sm: '2px',
      md: '4px',
      lg: '8px',
      xl: '12px',
    },
  },
  
  // Transitions
  transitions: {
    fast: 'all 0.2s ease',
    normal: 'all 0.3s ease',
    slow: 'all 0.5s ease',
  },
  
  // Shadows
  shadows: {
    small: '0 4px 12px',
    medium: '0 6px 16px',
    large: '0 20px 40px',
  },
  
  // Breakpoints
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1280px',
  },
} as const;

// Helper function to get current theme
export const getCurrentTheme = () => {
  // You can implement theme switching logic here
  return theme.colors.default;
};

// Helper function to generate CSS custom properties
export const generateCSSVariables = (colorScheme: keyof typeof theme.colors = 'default') => {
  const colors = theme.colors[colorScheme];
  
  return {
    '--color-primary': colors.primary,
    '--color-primary-hover': colors.primaryHover,
    '--color-primary-light': colors.primaryLight,
    '--color-text-primary': colors.textPrimary,
    '--color-text-secondary': colors.textSecondary,
    '--color-text-muted': colors.textMuted,
    '--color-text-white': colors.textWhite,
    '--color-background': colors.background,
    '--color-notebook-bg': colors.notebookBg,
    '--color-item-bg': colors.itemBg,

    '--color-success': colors.success,
    '--color-danger': colors.danger,
    '--color-info': colors.info,
  };
}; 