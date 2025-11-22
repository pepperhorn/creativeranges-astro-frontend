import type { Page } from '@/types/directus-schema';

/**
 * Get the effective accent color for a page, considering page-level overrides
 */
export const getEffectiveAccentColor = (page: Page | null, globalAccentColor?: string): string => {
  if (page?.accent_color_override) {
    return page.accent_color_override;
  }
  return globalAccentColor || 'var(--accent-color)';
};

/**
 * Get the effective background theme for a page, considering page-level overrides
 */
export const getEffectiveBackgroundTheme = (page: Page | null, blockBackground?: string | null): string | null => {
  // If page has background theme override, use it instead of block background
  if (page?.background_theme_override) {
    return page.background_theme_override;
  }
  
  // Fall back to block background
  return blockBackground || null;
};

/**
 * Get CSS custom properties for custom colors
 */
export const getCustomColorProperties = (page: Page | null): Record<string, string> => {
  const properties: Record<string, string> = {};
  
  if (page?.custom_background_color) {
    properties['--custom-background-color'] = page.custom_background_color;
  }
  
  if (page?.custom_text_color) {
    properties['--custom-text-color'] = page.custom_text_color;
  }
  
  if (page?.accent_color_override) {
    properties['--accent-color'] = page.accent_color_override;
  }
  
  return properties;
};

/**
 * Get CSS classes for background theme
 */
export const getBackgroundThemeClasses = (
  page: Page | null, 
  blockBackground?: string | null
): string => {
  const baseClasses = 'py-12 md:py-16 lg:py-20';
  const theme = getEffectiveBackgroundTheme(page, blockBackground);
  
  switch (theme) {
    case 'light':
      return `${baseClasses} bg-background text-foreground`;
    case 'dark':
      return `${baseClasses} bg-background-muted text-foreground`;
    case 'custom-light':
      return `${baseClasses} text-foreground`;
    case 'custom-dark':
      return `${baseClasses} text-white`;
    default:
      // Fall back to block background or default
      switch (blockBackground) {
        case 'light':
          return `${baseClasses} bg-background text-foreground`;
        case 'dark':
          return `${baseClasses} bg-background-muted text-foreground`;
        default:
          return baseClasses;
      }
  }
};

/**
 * Get inline styles for custom colors
 */
export const getCustomColorStyles = (page: Page | null, blockBackground?: string | null): React.CSSProperties => {
  const theme = getEffectiveBackgroundTheme(page, blockBackground);
  const customProperties = getCustomColorProperties(page);
  
  if (theme === 'custom-light' || theme === 'custom-dark') {
    return {
      backgroundColor: page?.custom_background_color || undefined,
      color: page?.custom_text_color || undefined,
      ...customProperties,
    };
  }
  
  return customProperties;
};




