# Styling System

This directory contains the organized styling system for the Todo app, designed for consistency and maintainability.

## File Structure

```
src/styles/
├── theme.ts          # Theme configuration with multiple color schemes
├── utilities.css     # Utility classes for common styles
└── README.md         # This documentation
```

## CSS Custom Properties

The app uses CSS custom properties (CSS variables) defined in `App.css` for consistent theming:

### Colors
- `--color-primary`: Main brand color
- `--color-primary-hover`: Hover state for primary elements
- `--color-primary-light`: Light variant of primary color
- `--color-text-primary`: Main text color
- `--color-text-secondary`: Secondary text color
- `--color-background`: Page background
- `--color-notebook-bg`: Notebook background
- `--color-item-bg`: Todo item background


### Spacing
- `--spacing-xs`: 4px
- `--spacing-sm`: 8px
- `--spacing-md`: 12px
- `--spacing-lg`: 16px
- `--spacing-xl`: 20px
- `--spacing-xxl`: 24px
- `--spacing-xxxl`: 30px
- `--spacing-xxxxl`: 40px

### Typography
- `--font-size-xs`: 12px
- `--font-size-sm`: 14px
- `--font-size-md`: 16px
- `--font-size-lg`: 18px
- `--font-size-xl`: 20px
- `--font-size-xxl`: 24px
- `--font-size-xxxl`: 48px

### Component Heights
- `--height-input`: 25px
- `--height-button`: 32px
- `--height-checkbox`: 20px
- `--height-delete-btn`: 24px
- `--height-filter-btn`: 25px
- `--height-todo-item`: 25px

## Utility Classes

The `utilities.css` file provides common utility classes:

### Flexbox
- `.flex`, `.flex-col`, `.flex-row`
- `.items-center`, `.justify-center`, `.justify-between`
- `.flex-1`, `.flex-shrink-0`

### Spacing
- `.gap-xs`, `.gap-sm`, `.gap-md`, `.gap-lg`, `.gap-xl`
- `.m-0`, `.m-xs`, `.m-sm`, `.m-md`, `.m-lg`, `.m-xl`
- `.p-0`, `.p-xs`, `.p-sm`, `.p-md`, `.p-lg`, `.p-xl`

### Text
- `.text-center`, `.text-left`, `.text-right`
- `.text-primary`, `.text-secondary`, `.text-muted`, `.text-white`
- `.font-xs`, `.font-sm`, `.font-md`, `.font-lg`, `.font-xl`
- `.font-normal`, `.font-medium`, `.font-bold`

### Borders & Backgrounds
- `.border-none`, `.border-primary`, `.border-secondary`
- `.rounded-none`, `.rounded-sm`, `.rounded-md`, `.rounded-lg`
- `.bg-primary`, `.bg-primary-light`, `.bg-primary-lighter`, `.bg-transparent`

### Effects
- `.shadow-none`, `.shadow-small`, `.shadow-medium`
- `.transition-none`, `.transition-fast`, `.transition-normal`, `.transition-slow`
- `.hover-lift`, `.hover-scale`

### Common Components
- `.btn`, `.btn-primary`, `.btn-outline`
- `.input`
- `.focus-ring`

## Theme System

The `theme.ts` file provides:

1. **Multiple Color Schemes**: Default, Dark, and Green themes
2. **Consistent Spacing**: Standardized spacing scale
3. **Typography**: Font families, sizes, and weights
4. **Component Dimensions**: Standardized component heights and border radius
5. **Transitions**: Consistent animation timing
6. **Breakpoints**: Responsive design breakpoints

### Using Themes

```typescript
import { theme, generateCSSVariables } from './styles/theme';

// Get current theme colors
const currentTheme = theme.colors.default;

// Generate CSS variables for a specific theme
const cssVars = generateCSSVariables('dark');
```

## Best Practices

1. **Use CSS Custom Properties**: Always use `var(--property-name)` instead of hardcoded values
2. **Use Utility Classes**: Leverage utility classes for common patterns
3. **Consistent Spacing**: Use the spacing scale for margins and padding
4. **Theme-Aware**: Design components to work with different color schemes
5. **Responsive**: Use the provided breakpoints for responsive design

## Adding New Styles

1. **For new colors**: Add to `theme.ts`
2. **For new spacing**: Add to the spacing scale in both files
3. **For new utilities**: Add to `utilities.css`
4. **For new components**: Use the existing patterns and CSS custom properties

## Migration Guide

When updating existing styles:

1. Replace hardcoded colors with CSS custom properties
2. Replace hardcoded spacing with the spacing scale
3. Use utility classes where appropriate
4. Ensure consistency with the design system 